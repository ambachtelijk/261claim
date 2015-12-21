/**
 * Include some goodies from PHP
 */
String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.ucwords = function() {
    return this.replace(/\b([a-z])/g, function(char) {
        return char.toUpperCase();
    });
};

String.prototype.CamelCase = function() {
    return this.toLowerCase().replace(/((^|[^\w])[\w])/g, function(char) {
        return char.substr(char.length - 1).toUpperCase();
    });
};

String.prototype.camelCase = function() {
    return this.toLowerCase().replace(/(([^\w])[\w])/g, function(char) {
        return char.substr(char.length - 1).toUpperCase();
    });
};

// Source: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
String.prototype.escape = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

String.prototype.trim2 = function(chars) {
    return this.replace(new RegExp("^["+chars.escape()+"]+|["+chars.escape()+"]+$", "g"), '');
};

module.exports = {
    // Source: http://phpjs.org/functions/array_combine/
    array_combine: function(keys, values) {

        var new_array = {},
            keycount = keys && keys.length,
            i = 0;

        // input sanitation
        if (typeof keys !== 'object' || typeof values !== 'object' || // Only accept arrays or array-like objects
            typeof keycount !== 'number' || typeof values.length !== 'number' || !keycount) { // Require arrays to have a count
            return false;
        }

        // number of elements does not match
        if (keycount !== values.length) {
            return false;
        }

        for (i = 0; i < keycount; i++) {
            new_array[keys[i]] = values[i];
        }

        return new_array;
    }
};