import { Document, Schema, Model, model } from 'mongoose';

const AreaSchema: Schema = new Schema({
    areaId: {
        type: String,
        required: true,
        unique: true,
    }
});

export interface IArea extends Document {
    areaId: string
}

export const Area: Model<IArea> = model<IArea>('Area', AreaSchema);