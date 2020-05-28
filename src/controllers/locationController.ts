import { Request, Response } from "express";
import { Location, ILocation } from "../models/location";

export class LocationController {
    public async getLocations(req: Request, res: Response): Promise<void> {
        const locations = await Location.find();
        res.json({ locations });
    }

    public async createLocation(req: Request, res: Response): Promise<void> {
        const newLocation: ILocation = new Location(req.body);
        //const location = await Location.findOne({ _id: req.params.locationId });
        const result = await newLocation.save();
        if (result == null) {
            res.sendStatus(500);
        } else {
            res.status(201).json({ status: 201, data: result });
        }
    }
}