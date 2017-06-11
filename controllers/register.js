var UserModel = require('../models/UserModel'),
    hash = require('../utils/crypto').hash,
    Client = require('node-rest-client').Client,
    PropertiesReader = require('properties-reader'),
    helper = require('../utils/helper');
var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');
module.exports.registerHandler = function (req, res) {
    var password = req.body.password;
    var username = req.body.username;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new UserModel.User({
            username: username,
            salt: salt,
            hash: hash,
        });
        var args = {
            data: user,
            headers: { "Content-Type": "application/json" }
        };
        client.get(properties.get('eureka.client.user.save.url') , function (data, response) {
            client.post(data.toString(), args, function (data, response) {
                helper.authenticate(data.username, password, function(err, user){
                    if(user){
                        req.session.regenerate(function(){
                            req.session.user = user;
                            req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                            res.redirect('/cleartrip');
                        });
                    }
                });
            });
        });
    });
}