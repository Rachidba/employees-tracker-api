import { Schema, Document, model, Model } from 'mongoose';

const LocationSchema: Schema = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    zone:  {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

export interface ILocation extends Document {
    employeeId: string;
    zone: string;
    time: Date
}

export const Location: Model<ILocation> = model<ILocation>('Location', LocationSchema);