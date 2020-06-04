import  { Schema, Document, model, Model} from 'mongoose';

const EmployeeSchema: Schema = new Schema({
    employeeId: {
        type: String,
        unique: true,
        required: true
    },
    firstName:{
        type: String
    },
    lastName: {
        type: String,
    },
    originAreaId: {
        type: Number,
        required: true
    }  
});

export interface IEmployee extends Document {
    employeeiD: string,
    firstName: string;
    lastName: string;
    originAreaId: number;
}

export const Employee: Model<IEmployee> = model<IEmployee>('Employee', EmployeeSchema);