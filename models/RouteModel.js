/*
Database and Models
*/
var PropertiesReader = require('properties-reader'),
    mongoose = require('mongoose');
var properties = PropertiesReader('./config/dev/application.properties');

mongoose.connect(properties.get('mongo.host.url'));
var RouteSchema = new mongoose.Schema({
    origin: String,
    destination: String,
    activeFlag: String,
    createdDate: String,
    updatedDate: String
});

module.exports.Route = mongoose.model('route', RouteSchema);