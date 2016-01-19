"use strict"
var Restler = require('restler');
var HttpError = require('http-errors');
var Path = require('path');
var Promise = require('bluebird');
var Moment = require('moment-timezone');
var Airport = app.db.import(Path.join(app.basedir, app.config.path.model, 'Airport'));
var Airline = app.db.import(Path.join(app.basedir, app.config.path.model, 'Airline'));
var Flight = require(Path.join(app.basedir, app.config.path.model, 'Flight'));

module.exports = ApiController.extend({
    searchAction: function(resolve, reject) {
        Restler.get(process.env.FXML_HOST + 'FlightInfoEx', {
            username: process.env.FXML_USER,
            password: process.env.FXML_PASS,
            query: {
                ident: this.req.query.icao + '' + this.req.query.flight,
                offset: 0
            }
        })
        .on('success', function (response) {
            if(response.FlightInfoExResult === undefined) {
                return reject(new HttpError(404, 'No flights found'));
            }
            console.log(response.FlightInfoExResult);
            // Start a promise chain
            var scope = {};
            Promise
                // Find the departure and arrival airports
                .try(function () {
                    // Get the airports to combine with the API results
                    var airports = [];
                    response.FlightInfoExResult.flights.forEach(function(flight) {
                        if(airports.indexOf(flight.origin) === -1) { airports.push(flight.origin); }
                        if(airports.indexOf(flight.destination) === -1) { airports.push(flight.destination); }
                    });

                    return Airport
                        .findAll({where: {'icao': {'$in': airports}}})
                        .then(function(airports) {
                            scope.airports = {};
                            for(var i in airports) { scope.airports[airports[i].icao] = airports[i]; }
                        }.bind(this));
                }.bind(this))
                
                // Find the airline for this flight
                .then(function() {
                    return Airline
                        .findOne({where: {'icao': this.req.query.icao}})
                        .then(function(airline) {
                            scope.airline = airline;
                        });
                }.bind(this))
                
                // Construct the flight object
                .then(function() {
                    response.FlightInfoExResult.flights.forEach(function(f) {
                        var flight = new Flight(f);
                        flight.setAirports(scope.airports);
                        flight.setAirline(scope.airline);
                        
                        // Input data is local timezone
                        var searchDate = Moment.tz(this.req.query.date, flight.origin.timezone);

                        // Check if this flight was on the queried day
                        if(flight.departure.isSame(searchDate, 'day')) {
                            this.res.results.push(flight);
                        }
                    }.bind(this));
                    resolve();
                }.bind(this))
                .catch(reject);
            
        }.bind(this))
        .on('error', function (error) {
            return reject(error);
        });
    }
});