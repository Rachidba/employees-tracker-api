import { Router } from "express";
import { AreaController } from "../controllers/areaController";
import { AuthController } from "../controllers/authController";

export class AreaRoutes {
    public router: Router;
    private areaController: AreaController;
    private authController: AuthController;

    public constructor() {
        this.router = Router();
        this.areaController = new AreaController();
        this.authController = new AuthController();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.authController.authorizeJWT, this.areaController.getAllAreas);
        this.router.get("/:areaId", this.authController.authorizeJWT, this.areaController.getArea);
        this.router.post("/", this.authController.authorizeJWT, this.areaController.createArea);
    }
}