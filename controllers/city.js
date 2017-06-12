var Client = require('node-rest-client').Client,
    PropertiesReader = require('properties-reader');

var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');
module.exports.citySearchHandler = function (req, res, callback) {
    client.get(properties.get('eureka.client.city.url') , function (data, response) {
        if (data[0] === null) {
            req.session.error = "City Service Not Available.Please contact the administrator.";
            res.redirect('/cleartrip/login');
        } else {
            client.get(data.toString(), function (data, response) {
                callback(undefined, data);
            });
        }
    });
}