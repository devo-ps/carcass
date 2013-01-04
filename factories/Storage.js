var debug = require('debug')('carcass:Factory:Storage');

var carcass = require('carcass');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

// .
var cache = {};

// Storage
// ---
// Abstract factory; returns a concrete factory.

// .
module.exports = function(args) {
    debug('building');

    args = args || {};

    // Also support only an initialize function as the argument.
    if (typeof args === 'function') {
        args = {
            initialize: args
        };
    }

    // .
    if (args.cache) {
        cache[args.cache] = cache[args.cache] || {};
    }

    // The concrete factory.
    function builder(options) {
        // Merge options from builder and factory.
        options = _.extend(_.omit(args, 'initialize'), options);

        // .
        var instance = carcass.mixable({});

        // .
        EventEmitter.call(instance);
        instance.mixin(EventEmitter.prototype);

        // .
        if (options.cache && cache[options.cache] && options.id) {
            if (cache[options.cache][options.id]) {
                return cache[options.cache][options.id];
            } else {
                cache[options.cache][options.id] = instance;
            }
        }

        // TODO: requires CRUD methods.
        // TODO: map variants of method names?

        // Invoke initialize function.
        if (args.initialize) {
            args.initialize(instance, options);
        }

        return instance;
    };

    return builder;
};