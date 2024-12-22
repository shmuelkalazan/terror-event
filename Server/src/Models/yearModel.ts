import mongoose, { Schema } from "mongoose";

export interface IYear extends Document{
    name: number
    events: Schema.Types.ObjectId []
}

const yearSchema = new Schema<IYear>({
    name: {
        type: Number,
        required: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'event',
        required: false
    }]
});

export default mongoose.model<IYear>('year', yearSchema)
