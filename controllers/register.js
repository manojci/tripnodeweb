var UserModel = require('../models/UserModel'),
    hash = require('../utils/crypto').hash,
    Client = require('node-rest-client').Client,
    PropertiesReader = require('properties-reader'),
    helper = require('../utils/helper');
var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');
module.exports.registerHandler = function (req, res) {
    hash(req.body.password, function (err, salt, hash) {
        if (err) throw err;
        var user = new UserModel.User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            salt: salt,
            hash: hash,
        });
        var args = {
            data: user,
            headers: { "Content-Type": "application/json" }
        };
        client.get(properties.get('eureka.client.user.save.url') , function (data, response) {
            if (data[0] === null) {
                req.session.error = "User Register Service Not Available.Please contact the administrator.";
                res.redirect('/cleartrip/register');
            } else {
                client.post(data.toString(), args, function (data, response) {
                    helper.authenticate(req, res, function(err, user){
                        if(user){
                            req.session.regenerate(function(){
                                req.session.user = user;
                                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                                res.redirect('/cleartrip');
                            });
                        }
                    });
                });
            }
        });
    });
}