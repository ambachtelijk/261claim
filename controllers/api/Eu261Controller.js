var merge = require('merge');
var php = require('../../php');

var HttpError = require('http-errors');
var ApiController = require('../_abstract/ApiController');

module.exports = function(app, req, res, next) {
    var parent = new ApiController(app, req, res, next);

    return merge(Object.create(parent), {
        eligibleRouteAction: function() {
            req.params = php.array_combine(['airline', 'departure', 'arrival'], req.params);

            if(req.params === false) {
                throw new HttpError(400, 'Input does not match syntax: <airline>/<departure>/<arrival>');
            }

            var Airlines = req.db.import('../../models/Airlines');


            Airlines.findById(req.params.airline).then(function(airline) {
                console.log(airline.iata);
            });


            res.data = req.params;
        }
    });
};