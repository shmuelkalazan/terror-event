import yearModel from "../Models/yearModel"

const getAverageOfCasualtiesByYear = async (year: number, number: number) => {
    try {
        let matchStage: any = {}; 
        if (year) {
            matchStage = { name: year };
        } else if (number) {
            const startYear = 2017 - number;
            matchStage = { name: { $gte: startYear, $lte: 2017 } };
        }
        return await yearModel.aggregate([
            { 
                $match: matchStage
            },
            {
                $project: { 
                    name: 1, 
                    average: { $divide: [{ $size: "$events" }, 12] } 
                }
            },
            {
                $limit: number || 1
            }
        ]);
    } catch (error) {
        console.error("Error fetching average by year: ", error);
        throw error;
    }
};

const getYearEventsByOrganization = async (year: number) => {
    try {
        return await yearModel.aggregate([
            { 
                $match: { name: year }
            },
            {
                $unwind: "$events"
            },
            {
                $lookup: {
                    from: "events",
                    localField: "events",
                    foreignField: "_id",
                    as: "eventDetails"
                }
            },
            {
                $unwind: "$eventDetails"
            },
            {
                $match: { "eventDetails.organization": { $ne: null } }
            },
            {
                $group: {
                    _id: "$eventDetails.organization",
                    eventCount: { $sum: 1 }
                }
            },
            {
                $sort: { eventCount: -1 }
            },
            {
                $project: {
                    _id: 0,
                    organization: "$_id",
                    eventCount: 1
                }
            }
        ]);
    } catch (error) {
        console.error("Error fetching events by organization for year: ", error);
        throw error;
    }
};

export default {
    getAverageOfCasualtiesByYear,
    getYearEventsByOrganization
};
