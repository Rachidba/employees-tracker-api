// app/models/location.js

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({
    employee_id: String,
    zone:  Number,
    time: Date,
});

module.exports = mongoose.model('Location', locationSchema);