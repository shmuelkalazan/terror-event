import mongoose, { Schema } from "mongoose";

export interface IAttackType extends Document{
    name: string
    dead: number
    wounded: number
    events: Schema.Types.ObjectId []
}

const attackTypeSchema = new Schema<IAttackType>({
    name: {
        type: String,
        required: true
    },
    dead: {
        type: Number,
        required: false
    },
    wounded: {
        type: Number,
        required: false
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'event',
        required: false
    }]
})

export default mongoose.model<IAttackType>('attackType', attackTypeSchema)
