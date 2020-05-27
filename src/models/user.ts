import { Schema, model, Document, Model } from 'mongoose';

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
})

export interface IUser extends Document {
    name: string;
    password: string;
    admin: boolean;
}

export const User: Model<IUser> = model<IUser>('User', UserSchema);