casper.on('remote.message', function(message) {
    this.echo('Message: '+ JSON.stringify(message));
});

casper.on('page.error', function(message, trace) {
    this.echo('Page error: ' + message);
    this.echo(JSON.stringify(trace));
});

casper.on('page.initialized', function() {
    this.evaluate(polyfillObjectAssign);
    this.evaluate(polyfillFunctionBind);
});

var polyfillFunctionBind = function() {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs   = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP    = function() {},
                fBound  = function() {
                    return fToBind.apply(this instanceof fNOP
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            if (this.prototype) {
                // native functions don't have a prototype
                fNOP.prototype = this.prototype;
            }
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
    console.log("Function.prototype.bind has been polyfilled");
};

var polyfillObjectAssign = function() {
    if (typeof Object.assign != 'function') {
          Object.assign = function (target) {
          'use strict';
          if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }

          var output = Object(target);
          for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
              for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                  output[nextKey] = source[nextKey];
                }
              }
            }
          }
          return output;
        };
    }
    console.log("Object.assign has been polyfilled");
};