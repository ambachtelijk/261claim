"use strict"
var HttpError = require('http-errors');

module.exports = ApiController.extend({
        airlineAction: function(next, iata) {
            var Airlines = req.db.import('../models/Airlines');
            
            Airlines.findById(iata).then(function(airline) {
                res.data = airline;
                next();
            });
        }
    });
};