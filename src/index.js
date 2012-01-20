/**
 * Wraps the given function so that the history log is saved when it is called, and then the given function
 * is run
 *
 * @param {Mocker} mocker     The mocker object
 * @param {Function} fn       The function to run
 * @return {Function}         The wrapped function
 * @api public
 */
function wrapFn(mocker, fn) {
  return function() {
    //Copy the arguments this function was called with
    var args = Array.prototype.slice.call(arguments);
    
    //Save the arguments to the log
    mocker.history.push(args);
    
    return fn.apply(this, arguments);
  };
}


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
  this.originalFn = obj[methodName];
  this.history = [];
  
  //Assign new function
  mockFn = mockFn || this.originalFn;
  obj[methodName] = wrapFn(this, mockFn);
};

Mocker.prototype.restore = function() {
  this.obj[this.methodName] = this.originalFn;
};

Mocker.prototype.lastArgs = function() {
  var history = this.history;
  
  return history[history.length - 1];
};

Mocker.prototype.timesCalled = function() {
  return this.history.length;
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
