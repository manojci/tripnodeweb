/*
Helper Functions
*/
var UserModel = require('../models/UserModel'),
    Client = require('node-rest-client').Client,
    PropertiesReader = require('properties-reader'),
    hash = require('./crypto').hash;

var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');

module.exports.authenticate = function (req, res, fn) {
        if (!module.parent) console.log('authenticating %s:%s', req.body.username, req.body.password);
        var queryString = "?username=" + req.body.username;
        client.get(properties.get('eureka.client.user.url') , function (data, response) {
            if (data[0] === null) {
                req.session.error = "User Register Service Not Available.Please contact the administrator.";
                res.redirect('/cleartrip/login');
            } else {
                client.get(data + queryString, function (data, response) {
                    if (data.username !== undefined) {
                        hash(req.body.password, data.salt, function (err, hash) {
                            if (err) return fn(err);
                            if (hash == data.hash) return fn(null, data);
                            fn(new Error('Authentication failed, please check your username and password!!'));
                        });
                    } else {
                        return fn(new Error('Wrong Credentials!!'));
                    }
                });
            }
        });
}
module.exports.requiredAuthentication = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/cleartrip/login');
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