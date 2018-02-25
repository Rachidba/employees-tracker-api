// app/models/employee.js

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var employeeSchema = new Schema({
    fname: String,
    lname: String,
    img_url: String,
    zone:  Number
});
module.exports = mongoose.model('Employee', employeeSchema);