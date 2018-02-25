//server.js

// BASE SETUP
// ===========================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/trackerDB');

var Employee = require('./app/models/employee');
var Location = require('./app/models/location'); 

var port = process.env.PORT || 8085; //set our port

// ROUTES FOR OUR API
// ================================================================================

var router = express.Router();  // get instance of express router

// Middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Somthing is happening.');
    next(); // Make sure we go to the next and don't stop here
});

router.get('/', function(req, res) {
    res.json({message: 'Welcom to our API:'});
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