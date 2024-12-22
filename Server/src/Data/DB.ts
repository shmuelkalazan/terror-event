import { connect } from "mongoose";
import fs from "fs";
import eventModel, { IEvent } from "../Models/eventModel";
import attackTypeModel from "../Models/attackTypeModel";
import countryModel from "../Models/countryModel";
import yearModel from "../Models/yearModel";
import organizationModel from "../Models/organizationModel";

export const conectToMongo = async () => {
    try {
        await connect(process.env.DB_URI as string)
        console.log("Connected to mongo");
        try {
            seadEventsData();
        } catch (error) {
            console.log("Can't sead data!");
        }
    } catch (error) {
        console.log("Can't connect to mongo", error)
        throw error
    }
};

export const seadEventsData = async () => {
    try {
        if(await eventModel.countDocuments() === 0) {
            const eventsData = JSON.parse(fs.readFileSync("./src/Data/DB.json", "utf8"))
            for (const event of eventsData) {
                const isValidEvent = await checkEventValidation(event)
                if (isValidEvent) {
                console.log("Save event: ", event.eventid);
                const newEvent = {
                    eventID: event.eventid.toString(),
                    type: event.attacktype1_txt,
                    dead: event.nkill || 0,
                    wounded: event.nwound || 0,
                    country: event.country_txt,
                    lat: event.latitude,
                    long: event.longitude,
                    year: event.iyear,
                    month: event.imonth,
                    day: event.iday,
                    organization: event.gname
                }
                const saveEvent = new eventModel(newEvent)
                try {
                    await saveEvent.save();
                } catch (error) {
                    console.log("event didn't save", error);
                    
                }
                await seadAttacksTypeData(saveEvent);
                await seadCountriesData(saveEvent);
                await seadYearsData(saveEvent);
                await seadOrganizationsData(saveEvent)
                }
            }
        }
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

export const checkEventValidation = async (event: any) => {    
    if(
        event.eventid &&
        event.attacktype1_txt &&
        event.country_txt &&
        event.latitude &&
        event.longitude &&
        event.iyear &&
        event.imonth &&
        event.iday &&
        event.gname
    ) {
        // console.log("event not valid");
        return true
    } 
    else return false   
};

export const seadAttacksTypeData = async (event: any) => {
    try {
        console.log("Create or update attack type");
        await attackTypeModel.findOneAndUpdate(
            { name: event.type },
            { $set: { name: event.attacktype1_txt, dead: event.dead, wounded: event.wounded }, $push: { events: event._id } },
            { upsert: true, new: true }
        );
        console.log("Attack type data updated successfully.");
    } catch (error) {
        console.log("Can't save attack type", error);
    }
};

export const seadCountriesData = async (event: any) => {
    try {
        console.log("Create or update country");
        const eventCasualties = (event.dead || 0) + (event.wounded || 0);
        const country = await countryModel.findOneAndUpdate(
            { name: event.country },
            { $inc: { casualties: eventCasualties }, $push: { events: event._id }, $setOnInsert: { organizations:[] } },
            { new: true, upsert: true }
        );
        const orgIndex = country.organizations.findIndex(org => org.name === event.organization)
        if (orgIndex !== -1) {
            country.organizations[orgIndex].events += 1;
            country.organizations[orgIndex].casualties += eventCasualties;
        } else {
            country.organizations.push({ name: event.organization, events: 1, casualties: eventCasualties } );
        }
        try {
            await country.save();
        } catch (error) {
            console.log("Can't save event in country collection");
        }   
    } catch (error) {
        console.log("Can't save country data", error);
    }
};

export const seadYearsData = async (event: any) => {
    try {
        console.log("Create or update year");
        const updatedYear = await yearModel.findOneAndUpdate(
            { name: event.year },
            { $addToSet: { events: event._id } },
            { new: true, upsert: true }
        );
        console.log("Year data updated successfully", updatedYear);
    } catch (error) {
        console.log("Can't save year", error);
    }
};

export const seadOrganizationsData = async (event: any) => {
    try {
        console.log("Create or update organization");
        const updatedorgganization = await organizationModel.findOneAndUpdate(
            { name: event.organization },
            { $addToSet: { events: event._id } },
            { new: true, upsert: true }
        );
        console.log("organization data updated successfully", updatedorgganization);
    } catch (error) {
        console.log("Can't save organization", error);
    }
};
