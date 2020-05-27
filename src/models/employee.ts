import  { Schema, Document, model, Model} from 'mongoose';

const EmployeeSchema: Schema = new Schema({
    firstName:{
        type: String
    },
    lastName: {
        type: String,
    },
    imgUrl: String,
    zone:  Number
});

export interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    imgUrl: string;
    zone: number;
}

export const Employee: Model<IEmployee> = model<IEmployee>('Employee', EmployeeSchema);