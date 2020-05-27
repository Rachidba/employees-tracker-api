//server.js

// BASE SETUP
// ===========================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

var mongoose = require('mongoose');
mongoose.connect(config.database);

var Employee = require('./models/employee');
var Location = require('./models/location'); 
var User     = require('./models/user')   

var port = process.env.PORT || 8085; //set our port

app.set('superSecret', config.secret); // secret variable

// use morgan to log requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// ================================================================================

var router = express.Router();  // get instance of express router

// basic route
router.get('/', function(req, res) {
    res.json({message: 'Welcom to our API!'});
});

// route to authenticate a user (POST http://localhost:8085/api/authenticate)
router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {
  
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
            var token = jwt.sign(payload, app.get('superSecret'), {
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


// route that will create a user 
router.get('/setup', function(req, res) {
    // Create a sample user
    var admin = new User({
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
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
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
router.route('/employees')
    //Create an employee
    .post(function(req, res) {
        var employee = new Employee();
        employee.fname = req.body.fname;
        employee.lname = req.body.lname;
        employee.img_url = req.body.img_url;
        employee.zone = req.body.zone;

        // Save employee and check for errors
        employee.save(function(err) {
            if (err) {
                res.send(err);
            } 
            res.json({message: 'Employee created !'});
        })
    })
    // Get all employees
    .get(function(req, res) {
        Employee.find(function(err, employees) {
            if (err) {
                res.send(err);
            }
            res.json(employees);
        });
    });
// on routes that end in /employees/:employee_id
// ----------------------------------------------------
router.route('/employees/:employee_id')

    // get the employee with that id (accessed at GET http://localhost:8085/api/employees/:employee_id)
    .get(function(req, res) {
        Employee.findById(req.params.employee_id, function(err, employee) {
            if (err)
                res.send(err);
            res.json(employee);
        });
    })
    // update the employee with this id (accessed at PUT http://localhost:8085/api/employees/:employee_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Employee.findById(req.params.employee_id, function(err, employee) {

            if (err)
                res.send(err);

            employee.fname = req.body.fname;  // update the employee info

            // save the empoyee
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Employee updated!' });
            });

        });
    })
    // delete the employee with this id (accessed at DELETE http://localhost:8080/api/employees/:employee_id)
    .delete(function(req, res) {
        Employee.remove({
            _id: req.params.employee_id
        }, function(err, employee) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// on routes that end in /locations
// -------------------------------------------------------------------------------------
router.route('/locations')
    //Create a location
    .post(function(req, res) {
        var location = new Locations();
        location.employee_id = req.body.fname;
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