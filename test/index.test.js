var mocker = require('../src');

var User;

exports['mocker'] = {
  setUp: function(done) {
    User = function User(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    };

    User.find = function(id) {
      return { id: id };
    };
    
    done();
  },
  
  'mocker.mock() replaces original method with mocked function': function(test) {
    var mockFn = function() {
      return 'mocked';
    };
    
    var mock = mocker.mock(User, 'find', mockFn);

    test.same(User.find, mockFn);
    test.same(User.find(), 'mocked');
    
    test.done();
  },
  
  'mock.restore() restores the original method': function(test) {
    var originalFn = User.find,
        mockFn = function() { return 'mocked!'; };
    
    var mock = mocker.mock(User, 'find', mockFn);
    
    mock.restore();
    
    test.same(User.find, originalFn);
    test.same(User.find(3).id, 3);
    
    test.done();
  },
 
  'mock.lastArgs() returns the arguments the mocked function was called with': {
    'with original function': function(test) {
      var mock = mocker.mock(User, 'find');

      User.find(123, 'X');
      test.same(mock.lastArgs(), [123, 'X']);

      User.find(456, 'Y');
      test.same(mock.lastArgs(), [456, 'Y']);

      test.done();
    },
    
    'with custom function': function(test) {
      test.ok(false);
      test.done();
    }
  },
  
  'mock.timesCalled() returns the arguments the mocked function was called with': {
    'with original function': function(test) {
      var mock = mocker.mock(User, 'find');

      User.find(1);
      User.find(2);
      User.find(3);

      test.same(mock.timesCalled(), 3);

      test.done();
    },

    'with custom function': function(test) {
      test.ok(false);
      test.done();
    }
  },  
};
