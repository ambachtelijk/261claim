"use strict"
module.exports = BaseController.extend({
    before: function(next) {
        res.data = {};
        next();
    },
    after: function(next) {
        res.json(res.data);
        next();
    }
});