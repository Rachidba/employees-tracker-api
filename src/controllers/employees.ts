import { Request, Response } from "express";
import { Employee, IEmployee } from '../models/employee'

export class EmployeeController {
    public async getEmployees(req: Request, res: Response): Promise<void> {
        const employees = await Employee.find();
        res.json({ employees });
    }

    public async getEmployee(req: Request, res: Response): Promise<void> {
        const employee = await Employee.findOne({ _id: req.params.employeeId });
        if (employee == null)
            res.sendStatus(404);
        else res.json(employee);
    }

    public async createEmployee(req: Request, res: Response): Promise<void> {
        const newEmployee: IEmployee = new Employee(req.body);
        const employee = await Employee.findOne({ _id: req.body.employeeId });
        if (employee == null) {
            const result = await newEmployee.save();
            if (result == null) {
                res.sendStatus(500);
            } else {
                res.status(201).json({ status: 201, data: result });
            }
        } else {
            res.sendStatus(422);
        }
    }

    public async updateEmployee(req: Request, res: Response): Promise<void> {
        const employee = await Employee.findOneAndUpdate({ _id: req.params.employeeId }, req.body);
        if (employee == null) {
            res.sendStatus(404);
        } else {
            const updatedEmployee = { employeeId: req.params.employeeId, ...req.body };
            res.json({ status: res.status, data: updatedEmployee });
        }
    }

    public async deleteEmployee(req: Request, res: Response): Promise<void> {
        const employee = await Employee.findOneAndDelete({ _id: req.params.employeeId });
        if (employee == null) {
            res.sendStatus(404);
        } else {
            res.json({ response: "The employee deleted Successfully" });
        }
    }
}