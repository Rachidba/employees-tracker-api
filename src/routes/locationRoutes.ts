import { Router } from "express";
import { LocationController } from "../controllers/locationController";
import { AuthController } from "../controllers/authController";

export class LocationRoutes {
    public router: Router;
    public employeeController: LocationController = new LocationController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.authController.authorizeJWT, this.employeeController.getLocations);
        this.router.post("/", this.authController.authorizeJWT, this.employeeController.createLocation);
    }
}