import { Request, Response } from "express";
import yearService from "../Services/yearService";

export const getAverageOfCasualtiesByYear = async (req:Request ,res:Response) => {
    try {
        const { year, number } = req.params;
        const selectedYear = year ? parseInt(year) : 2017
        const selectedNumber = number ? parseInt(number) : 1
        const averageOfCasualtiesByYear = await yearService.getAverageOfCasualtiesByYear(selectedYear, selectedNumber);
        res.status(200).json(averageOfCasualtiesByYear)
    } catch (err) {
        res.status(400).json((err as Error).message) 
    }
};

export const getYearEventsByOrganization = async (req:Request ,res:Response) => {
    try {
        const { year } = req.params;
        const selectedYear = year ? parseInt(year) : 2017
        const yearEventsByOrganization = await yearService.getYearEventsByOrganization(selectedYear);
        res.status(200).json(yearEventsByOrganization)
    } catch (err) {
        res.status(400).json((err as Error).message)
    }
};
