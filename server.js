//server.js

// BASE SETUP
// ===========================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8085; //set our port

// ROUTES FOR OUR API
// ================================================================================

var router = express.Router();  // get instance of express router

router.get('/', function(req, res) {
    res.json({message: 'Welcom to the API:'});
});



// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port)
console.log('Magic happens on port ' + port);


