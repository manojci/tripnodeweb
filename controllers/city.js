var Client = require('node-rest-client').Client,
    PropertiesReader = require('properties-reader');

var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');
module.exports.citySearchHandler = function (req, res, callback) {
    client.get(properties.get('eureka.client.city.url') , function (data, response) {
        if (data[0] === null) {
            callback(data[0], data);
        } else {
            client.get(data.toString(), function (data, response) {
                callback(undefined, data);
            });
        }
    });
}