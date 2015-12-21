var merge = require('merge');
var BaseController = require('../_abstract/BaseController');

module.exports = merge(Object.create(BaseController), {
    before: function() {
        this.res.data = {};
    },
    after: function() {
        this.res.json(this.res.data);
    }
});