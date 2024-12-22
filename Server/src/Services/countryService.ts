import countryModel from "../Models/countryModel";
import mongoose, { PipelineStage } from "mongoose";

const getAverageCasualtiesByCountry = async () => {
    try {
        return await countryModel.aggregate([
            {
                $project: { name: 1, average: { $divide: ["$casualties", { $size: "$events" }]  } }
            },
            {
                $sort: { average: -1 }
            }
        ])
    } catch (error) {
        console.error("Error fetching average of countries: ", error);
        throw error;
    }
};

const getAverageCasualtiesByCountryId = async (countryId: string) => {
    try {console.log(countryId, ); 
        return await countryModel.aggregate([
            { 
                $match: { _id: new mongoose.Types.ObjectId(countryId) }
            },
            {
                $project: { name: 1, average: { $divide: ["$casualties", { $size: "$events" }] } }
            }
        ]);
    } catch (error) {
        console.error("Error fetching average of country: ", error);
        throw error;
    }
};

const getOrganizationByCountry = async (country: string, limit: number = 0) => {
    try {
        const pipeline: PipelineStage[] = [
            {
                $match: { name: country }
            },
            {
                $unwind: { path: "$organizations", preserveNullAndEmptyArrays: false }
            },
            {
                $project: {
                    name: "$organizations.name",
                    events: "$organizations.events"
                }
            },
            {
                $sort: { events: -1 }
            }
        ];
        if (limit > 0) {
            pipeline.push({ $limit: limit });
        }
        return await countryModel.aggregate(pipeline);
    } catch (error) {
        console.error("Error fetching organization of country: ", error);
        throw error;
    }
};

const getOrganizationByCasualtiesNumber = async (country: string) => {
    try {
        return await countryModel.aggregate([
            {
                $match: { _id: country }
            },
            {
                $unwind: { path: "$organizations" }
            },
            {
                $sort: { "organizations.casualties": -1 }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    _id: 0,
                    name: "$organizations.name",
                    casualties: "$organizations.casualties"
                }
            }
        ]);
    } catch (error) {
        console.error("Error fetching organization with highest casualties: ", error);
        throw error;
    }
};

const getCountriesWhereOrganizationIsTop = async (organizationName: string) => {
    try {
        return await countryModel.aggregate([
            {
                $unwind: { path: "$organizations" }
            },
            {
                $sort: { "organizations.casualties": -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    countryName: { $first: "$name" },
                    topOrganization: { $first: "$organizations.name" },
                    topCasualties: { $first: "$organizations.casualties" }
                }
            },
            {
                $match: { topOrganization: organizationName }
            },
            {
                $project: {
                    _id: 0,
                    country: "$countryName",
                    casualties: "$topCasualties"
                }
            }
        ]);
    } catch (error) {
        console.error("Error fetching countries where organization is top: ", error);
        throw error;
    }
};

export default {
    getAverageCasualtiesByCountry,
    getAverageCasualtiesByCountryId,
    getOrganizationByCountry,
    getOrganizationByCasualtiesNumber,
    getCountriesWhereOrganizationIsTop
};
