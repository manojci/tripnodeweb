var Client = require('node-rest-client').Client,
    PropertiesReader = require('properties-reader');
var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');

module.exports.searchHandler = function (req, res, callback) {
var queryString = "?origin=" + req.body.origin + "&destination=" + req.body.destination; 
client.get(properties.get('eureka.client.travel-details.url') , function (data, response) {
    client.get(data + queryString , function (data, response) {
        callback(undefined, data);
    });
});
}