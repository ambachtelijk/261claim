var merge = require('merge');
var php = require('../../php');

var HttpError = require('http-errors');
var ApiController = require('../_abstract/ApiController');

module.exports = merge(Object.create(ApiController), {
    eligibleRouteAction: function() {
        this.req.params = php.array_combine(['airline', 'departure', 'arrival'], this.req.params);
        
        if(this.req.params === false) {
            throw new HttpError(400, 'Input does not match syntax: <airline>/<departure>/<arrival>');
        }
        
        var Airlines = this.req.db.import('../../models/Airlines');
        
        
        Airlines.findById(this.req.params.airline).then(function(airline) {
            console.log(airline.iata);
        });
        /*
        this.req.db.query("SELECT * FROM airlines WHERE iata = ?", [this.req.params.airline], function(err, rows) {
            console.log(err);
            console.log(rows);
            
        });
         */
        
        this.res.data = this.req.params;
    }
});