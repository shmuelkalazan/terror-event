import mongoose, { Schema } from "mongoose";

export interface ICountry extends Document {
    name: string
    casualties: number
    organizations: { name: string, events: number, casualties: number } []
    events: Schema.Types.ObjectId []
};

const OrganizationObject = new Schema({
    name: { type: String, required: true },
    events: { type: Number, required: true },
    casualties: { type: Number, required: true }
});


const countrySchema = new Schema<ICountry>({
    name: {
        type: String,
        required: true
    },
    casualties: {
        type: Number,
        required: false
    },
    organizations: {
        type: [OrganizationObject],
        required: false
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'event',
        required: false
    }]
})

export default mongoose.model<ICountry>('country', countrySchema)
