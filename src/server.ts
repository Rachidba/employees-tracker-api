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

import { Employee } from './models/employee';
import { Location } from './models/location';
import { User  } from './models/user'; 

import { EmployeeController } from './controllers/employees';

const port = process.env.PORT || 8085;

app.set('superSecret', config.secret);

app.use(morgan('dev'));

// ROUTES FOR OUR API
// ================================================================================

const router = express.Router();


router.get('/', function(req, res) {
    res.json({message: 'Welcom to our API!'});
});

router.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
    },
    function(err, user) {
        if (err) throw err;
  
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
  
        // check if password matches
        if (user.password != req.body.password) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
  
            // if user is found and password is right
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password
            const payload = {
                admin: user.admin 
            };
            const token = jwt.sign(payload, app.get('superSecret'), {
                expiresIn: '1440m'  // expires in 24 hours
            });
  
            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        }   
      } 
    });
});


router.get('/setup', function(req, res) {
    const admin = new User({
        name: 'admin',
        password: 'password',
        admin: true
    });

    // Save the sample user
    admin.save(function(err) {
        if (err) throw err;

        res.json({ success: true });
    });
});

// route middleware to verify a token
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err: any, decoded: any) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;    
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });

    }
});



// on routes that end in /employees
// -------------------------------------------------------------------------
const employeeController = new EmployeeController();

router.route('/employees')
    .post(employeeController.createEmployee)
    .get(employeeController.getEmployees);

// on routes that end in /employees/:employeeId
// ----------------------------------------------------
router.route('/employees/:employeeId')
    .get(employeeController.getEmployee)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);

// on routes that end in /locations
// -------------------------------------------------------------------------------------
router.route('/locations')
    .post(function(req, res) {
        const location = new Location();
        location.employeeId = req.body.fname;
        location.zone = req.body.zone;
        location.time = req.body.time;

        // Save location and check for errors
        location.save(function(err) {
            if (err) {
                res.send(err);
            } 
            res.json({message: 'Location created !'});
        })
    })
    // Get all locations
    .get(function(req, res) {
        Location.find(function(err, locations) {
            if (err)
                res.send(err);
            res.json(locations);
        });
    });

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port)
console.log('Magic happens on port ' + port);