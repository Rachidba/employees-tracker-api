import { Request, Response } from "express";
import { Movement, IMovement } from "../models/movement";

export class MovementController {
    public async getMovements(req: Request, res: Response): Promise<void> {
        const movements = await Movement.find();
        res.json({ movements: movements });
    }

    public async createMovement(req: Request, res: Response): Promise<void> {
        const newMovement: IMovement = new Movement(req.body);
        const result = await newMovement.save();
        if (result == null) {
            res.sendStatus(500);
        } else {
            res.status(201).json({ status: 201, data: result });
        }
    }
}