var _ = require('underscore');

/**
 * Mocker constructor
 *
 * @param {Object} obj            Object to create a mock of
 * @param {String} methodName     Method name to mock
 * @param {Function} mockFn       Mock function
 * @return {Mocker}
 * @api public
 */
function Mocker(obj, methodName, mockFn) {
  this.obj = obj;
  this.methodName = methodName;
  this.mockFn = mockFn;
  this.originalFn = obj[methodName];
  this.history = [];
  
  //Assign new function
  if (mockFn) {
    obj[methodName] = mockFn;
  } else {
    //TODO: Create and assign a function which counts times called, saves args etc.
    obj[methodName] = (function(mocker) {
      return function() {
        var args = Array.prototype.slice.call(arguments);
        
        mocker.history.push(args);
      }
    })(this);
  }
};

Mocker.prototype.restore = function() {
  this.obj[this.methodName] = this.originalFn;
};

Mocker.prototype.lastArgs = function() {
  return _.last(this.history);
};


/**
 * Creates a new Mocker
 *
 * @param {Object} obj            Object to create a mock of
 * @param {String} methodName     Method name to mock
 * @param {Function} mockFn       Mock function
 * @return {Mocker}
 * @api public
 */
exports.mock = function(obj, methodName, mockFn) {
  return new Mocker(obj, methodName, mockFn);
};
