import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from '../config';
import mongoose from 'mongoose';
import { EmployeeRoutes } from './routes/employeeRoutes';
import { LocationRoutes } from './routes/locationRoutes';
import { AuthRoutes } from './routes/authRoutes';
import { AreaRoutes } from './routes/areaRoutes';

class Server {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.configure();
        this.setRoutes();
        this.connectWithDb();
    }

    private configure(): void {
        this.app.set("port", process.env.PORT || 8085);
        this.app.use(bodyParser.urlencoded({ extended: true}));
        this.app.use(bodyParser.json()); 
        this.app.use(morgan('dev'));
    }

    private setRoutes(): void {
        this.app.use('/api/auth', new AuthRoutes().router);
        this.app.use("/api/employees", new EmployeeRoutes().router);
        this.app.use("/api/locations", new LocationRoutes().router);
        this.app.use("/api/areas", new AreaRoutes().router);
    }

    private connectWithDb(): void {
        mongoose.connect(config.database);
    } 

    public start(): void {
        this.app.listen(this.app.get("port"), () => {
            console.log("  API is running at http://localhost:%d", this.app.get("port"));
        });
    }
}

const server = new Server();

server.start();