import attackTypeModel from "../Models/attackTypeModel"
import countryModel from "../Models/countryModel";

const getEventsByCasualties = async () => {
    try {
        return await attackTypeModel.aggregate([
            { 
                $project: { name: 1, eventsCount: { $size: "$events" } }
            },
            {
                $sort: { eventsCount: -1 }
            }
        ]);
    } catch (error) {
        console.error("Error fetching events by casualties: ", error);
        throw error;
    }
};

export default {
    getEventsByCasualties
};