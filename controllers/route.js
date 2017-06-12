var Client = require('node-rest-client').Client,
    RouteModel = require('../models/RouteModel'),
    PropertiesReader = require('properties-reader');
var client = new Client();
var properties = PropertiesReader('./config/dev/application.properties');

module.exports.routeHandler = function (req, res, callback) {
    if (req.body.origin === req.body.destination) {
        req.session.error = "Origin and Destination are Same!!!";
        res.redirect('/cleartrip/add/route');
    } else {
        var route = new RouteModel.Route({
            origin: req.body.origin,
            destination: req.body.destination,
            activeFlag: 'Y'
        });
        var args = {
            data: route,
            headers: { "Content-Type": "application/json" }
        };
        var queryString = "?origin=" + req.body.origin + "&destination=" + req.body.destination;
        client.get(properties.get('eureka.client.route.url') , function (data, response) {
            if (data[0] === null) {
                req.session.error = "Route Service Not Available.Please contact the administrator.";
                res.redirect('/cleartrip/route');
            } else {
                client.get(data + queryString, function (data, response) {
                    if(data.id !== undefined) {
                        req.session.error = "Route Already Available!!";
                        res.redirect('/cleartrip/add/route');
                    } else {
                        client.get(properties.get('eureka.client.route.save.url') , function (data, response) {
                            client.post(data.toString(), args, function (data, response) {
                                req.session.success = "Route Added Successfully";
                                res.redirect('/cleartrip/admin/home');
                            });
                        });
                    }
                });
            }
        });
    }
}