/*
Helper Functions
*/
var UserModel = require('../models/UserModel'),
    Client = require('node-rest-client').Client,
    PropertiesReader = require('properties-reader'),
    hash = require('./crypto').hash;

var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');

module.exports.authenticate = function (name, pass, fn) {
        if (!module.parent) console.log('authenticating %s:%s', name, pass);
        var queryString = "?username=" + name;
        client.get(properties.get('eureka.client.user.url') , function (data, response) {
            client.get(data + queryString, function (data, response) {
                if (data) {
                    hash(pass, data.salt, function (err, hash) {
                        if (err) return fn(err);
                        if (hash == data.hash) return fn(null, data);
                        fn(new Error('invalid password'));
                    });
                } else {
                    return fn(new Error('cannot find user'));
                }
            });
        });
}
module.exports.requiredAuthentication = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}
module.exports.userExist = function (req, res, next) {
    UserModel.User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}