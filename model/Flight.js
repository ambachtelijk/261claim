"use strict"
var Moment = require('moment-timezone');

module.exports = function(flight) {
    return {
        aircraft: flight.aircrafttype,
        airline: null,
        setAirports: function(airports) {
            this.departure =        Moment(flight.filed_departuretime, 'X').tz(airports[flight.origin].timezone);
            this.actualDeparture =  Moment(flight.actualdeparturetime, 'X').tz(airports[flight.origin].timezone);
            this.arrival =          Moment(flight.estimatedarrivaltime, 'X').tz(airports[flight.destination].timezone);
            this.actualArrival =    Moment(flight.actualarrivaltime, 'X').tz(airports[flight.destination].timezone);
            
            this.diff = {
                arrival: {
                    days: this.actualArrival.diff(this.arrival, 'days'),
                    hours: this.actualArrival.diff(this.arrival, 'hours'),
                    minutes: this.actualArrival.diff(this.arrival, 'minutes'),
                    seconds: this.actualArrival.diff(this.arrival, 'seconds')
                },
                departure: {
                    days: this.actualDeparture.diff(this.departure, 'days'),
                    hours: this.actualDeparture.diff(this.departure, 'hours'),
                    minutes: this.actualDeparture.diff(this.departure, 'minutes'),
                    seconds: this.actualDeparture.diff(this.departure, 'seconds')
                }
            };
            
            this.origin =           airports[flight.origin];
            this.destination =      airports[flight.destination];
            
        },
        setAirline: function(airline) {
            this.airline = airline;
        }
    };
};