import { Router } from "express";
import { EmployeeController } from "../controllers/employeeController";
import { AuthController } from "../controllers/authController";


export class EmployeeRoutes {
    public router: Router;
    public employeeController: EmployeeController = new EmployeeController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.authController.authorizeJWT, this.employeeController.getEmployees);
        this.router.post("/", this.authController.authorizeJWT, this.employeeController.createEmployee);
        this.router.get("/:employeeId", this.authController.authorizeJWT, this.employeeController.getEmployee);
        this.router.put("/:employeeId", this.authController.authorizeJWT, this.employeeController.updateEmployee);
        this.router.delete("/:employeeId", this.authController.authorizeJWT, this.employeeController.deleteEmployee);
    }
}