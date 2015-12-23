var merge = require('merge');

var HttpError = require('http-errors');
var ApiController = require('../_abstract/ApiController');

module.exports = function(app, req, res, next) {
    var parent = new ApiController(app, req, res, next);

    return merge(Object.create(parent), {
        eligibleRouteAction: function(airline, departure, arrival) {
            if(!airline || !departure || !arrival) {
                throw new HttpError(400, 'Input does not match syntax: <airline>/<departure>/<arrival>');
            }

            var Airlines = req.db.import('../../models/Airlines');

            Airlines.findById(airline).then(function(airline) {
                console.log(airline.iata);
            });

            res.data = [airline, departure, arrival];
        }
    });
};