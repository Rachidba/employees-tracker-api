import { Router } from "express";
import { AuthController } from "../controllers/authController";


export class AuthRoutes {
    public router: Router;
    private authController: AuthController;
    
    public constructor() {
        this.router = Router();
        this.authController = new AuthController();
        this.routes();
    }

    private routes() {
        this.router.get("/setup", this.authController.setup);
        this.router.post("/authenticate", this.authController.authenticateJWT);
    }
}