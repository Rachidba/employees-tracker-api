import { Schema, Document, model, Model } from 'mongoose';

const MovementSchema: Schema = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    areaId:  {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface IMovement extends Document {
    employeeId: string;
    areaId: string;
    createdAt: Date
}

export const Movement: Model<IMovement> = model<IMovement>('Movement', MovementSchema);