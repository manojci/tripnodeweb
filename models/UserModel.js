/*
Database and Models
*/
var PropertiesReader = require('properties-reader'),
    mongoose = require('mongoose');
var properties = PropertiesReader('./config/dev/application.properties');

mongoose.connect(properties.get('mongo.host.url'));
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    gender: String,
    salt: String,
    hash: String
});

module.exports.User = mongoose.model('users', UserSchema);