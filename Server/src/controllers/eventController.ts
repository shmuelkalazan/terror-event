import { Request, Response } from "express"
import eventService from "../Services/eventService"

export const getEventsByCasualties = async (req:Request<any, any, any>,res:Response) => {
    try {
        const eventsByCasualties = await eventService.getEventsByCasualties()
        res.status(200).json(eventsByCasualties)
    } catch (err) {
        res.status(400).json((err as Error).message) 
    }
};
