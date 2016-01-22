"use strict"
var Moment = require('moment-timezone');

module.exports = function(flight) {
  return {
    aircraft: flight.aircrafttype,
    airline: null,
    setAirports: function(airports) {
      this.departure       = flight.filed_departuretime !== -1 ? Moment(flight.filed_departuretime, 'X').tz(airports[flight.origin].timezone) : null;
      this.actualDeparture = flight.actualdeparturetime !== -1 ? Moment(flight.actualdeparturetime, 'X').tz(airports[flight.origin].timezone) : null;
      this.arrival         = flight.filed_ete !== -1 ? Moment(this.departure).add(Moment.duration(flight.filed_ete)).tz(airports[flight.destination].timezone) : null;
      this.actualArrival   = flight.actualarrivaltime !== -1 ? Moment(flight.actualarrivaltime, 'X').tz(airports[flight.destination].timezone) : null;
      
      this.diff = {
        arrival: this.actualArrival && this.arrival ? {
          d: this.actualArrival.diff(this.arrival, 'days'),
          h: this.actualArrival.diff(this.arrival, 'hours'),
          min: this.actualArrival.diff(this.arrival, 'minutes'),
          s: this.actualArrival.diff(this.arrival, 'seconds')
        } : null,
        departure: this.actualDeparture && this.departure ? {
          d: this.actualDeparture.diff(this.departure, 'days'),
          h: this.actualDeparture.diff(this.departure, 'hours'),
          min: this.actualDeparture.diff(this.departure, 'minutes'),
          s: this.actualDeparture.diff(this.departure, 'seconds')
        } : null
      };
      
      this.origin =       airports[flight.origin];
      this.destination =    airports[flight.destination];
      
    },
    setAirline: function(airline) {
      this.airline = airline;
    }
  };
};