import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

import jwt from 'jsonwebtoken';

import config from '../config';

import mongoose from 'mongoose';
mongoose.connect(config.database);


import { EmployeeController } from './controllers/employeeController';
import { LocationController } from './controllers/locationController';
import { AuthController } from './controllers/authController';

const port = process.env.PORT || 8085;

app.set('superSecret', config.secret);

app.use(morgan('dev'));

// ROUTES FOR OUR API
// ================================================================================
const router = express.Router();

router.get('/', function(req, res) {
    res.json({message: 'Welcom to our API!'});
});

const authController = new AuthController();
router.get('/setup', authController.setup);
router.post('/authenticate', authController.authenticateJWT);

router.use(authController.authorizeJWT);

const employeeController = new EmployeeController();

router.route('/employees')
    .post(employeeController.createEmployee)
    .get(employeeController.getEmployees);

router.route('/employees/:employeeId')
    .get(employeeController.getEmployee)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);

const locationController = new LocationController();
router.route('/locations')
    .post(locationController.createLocation)
    .get(locationController.getLocations);

app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port)
console.log('Magic happens on port ' + port);