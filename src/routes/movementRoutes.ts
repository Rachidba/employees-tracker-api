import { Router } from "express";
import { MovementController } from "../controllers/movementController";
import { AuthController } from "../controllers/authController";

export class MovementRoutes {
    public router: Router;
    public movementController: MovementController = new MovementController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.authController.authorizeJWT, this.movementController.getMovements);
        this.router.post("/", this.authController.authorizeJWT, this.movementController.createMovement);
    }
}