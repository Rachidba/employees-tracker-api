import { Request, Response } from "express";
import { Area } from "../models/area";

export class AreaController {
    public async createArea(req: Request, res: Response): Promise<void> {
        const newArea = new Area(req.body);
        const area = await Area.findOne({ areaId: newArea.areaId});
        if (area == null) {
            const result = await newArea.save();
            if (result == null) {
                res.sendStatus(500);
            } else {
                res.status(201).json({ status: 201, data: result })
            }
        } else {
            res.sendStatus(422);
        }
    }

    public async getArea(req: Request, res: Response): Promise<void> {
        const area = await Area.findOne({ areaId: req.params.areaId });
        if (area == null) {
            res.sendStatus(404);
        } else res.json(area);
    }

    public async getAllAreas(req: Request, res: Response): Promise<void> {
        const areas = await Area.find();
        res.json(areas);
    }
}