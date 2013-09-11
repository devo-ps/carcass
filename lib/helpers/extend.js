var carcass = require('../..');
var util = require('util');

/**
 * Very similar to Backbone's `extend()`, with 2 differences:
 * 
 * 1. I use my `mixin()` to copy properties.
 * 
 * 2. I use `util.inherits()` to inherit prototypes.
 * 
 * @param {Object} protoProps
 * @return {Object} child
 */
module.exports = function extend(protoProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the 'constructor' property in your `extend` definition), or defaulted by
    // us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() {
            return parent.apply(this, arguments);
        };
    }

    // Ensure it's mixable.
    carcass.mixable(child);

    // Copy static properties.
    child.mixin(parent);

    // Inherit.
    util.inherits(child, parent);

    // Add prototype properties (instance properties) to the subclass, if
    // supplied.
    if (protoProps) child.prototype.mixin(protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};