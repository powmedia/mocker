/**
 * Module dependencies
 */
var sinon = require('sinon');

// [22/06/2012 11:33:45] Charles: var sinon = require('sinon');
// 
// setUp: function(done) {
//   this.sinon = sinon.sandbox.create();
//   done();
// },
// 
// tearDown: function(done) {
//   this.sinon.restore();
//   done();
// },
// 
// main: function(test) {
//   //Just watch a method, without replacing it:
//   this.sinon.spy(User, 'find');
// 
//   //Replace a method like in mocker:
//   this.sinon.stub(User, 'find', function(criteria, cb) {
//     cb(null, {foo: 'bar'});
//   });
// 
//   //Test something:
//   test.ok(User.find.called);
// 
//   console.log(User.find.args[0]);
// }

exports.sandbox = sinon.sandbox.create();

/**
 * Creates a new Mocker
 *
 * @param {Object} obj            Object to create a mock of
 * @param {String} methodName     Method name to mock
 * @param {Function} mockFn       Mock function
 * @return {Mocker}
 * @api public
 */

exports.mock = function() {
  var methodName = (arguments.length > 2) ? 'stub' : 'spy';
  
  var mock = exports.sandbox[methodName].apply(exports.sandbox, arguments);

  mock.lastArgs = function(){
    return mock.args[mock.args.length - 1];
  };
  
  mock.__defineGetter__('history', function(){
    return mock.args;
  });
  
  mock.timesCalled = function(){
    return mock.callCount;
  };
  
  return mock;  
}

/**
 * Restores all mocks and release
 *
 * @api public
 */
exports.restore = function(){
  exports.sandbox.restore();
  exports.sandbox = sinon.sandbox.create();
}