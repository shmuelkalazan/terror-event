import mongoose, { Schema } from "mongoose";

export interface IOrganization extends Document{
    name: string
    events: Schema.Types.ObjectId []
}

const organizationSchema = new Schema<IOrganization>({
    name: {
        type: String,
        required: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'event',
        required: false
    }]
})

export default mongoose.model<IOrganization>('organization', organizationSchema)
