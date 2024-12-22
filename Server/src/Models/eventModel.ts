import mongoose, { Schema } from "mongoose";

export interface IEvent extends Document{
    eventID: string
    type: string;
    dead: number;
    wounded: number;
    city: string;
    country: string;
    lat: number;
    long: number;
    year: number;
    month: number;
    day: number;
    organization: string;
}

const eventSchema = new Schema<IEvent>({
    eventID: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    dead: {
        type: Number,
        required: true
    },
    wounded: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    organization: {
        type: String,
        required: true
    }
})

export default mongoose.model<IEvent>('event', eventSchema)
