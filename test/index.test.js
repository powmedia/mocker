var mocker = require('../src');

var User;

exports['mocker'] = {
  setUp: function(done) {
    User = function User(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    };
    
    User.prototype.fullName = function(prefix, suffix) {
      prefix = prefix || '';
      suffix = suffix || '';
      
      return prefix + this.firstName + ' ' + this.lastName + suffix;
    };

    User.find = function(id) {
      return { id: id };
    };
    
    done();
  },
  
  'mocker.mock() replaces original method with mocked function': {
    'for static/class method': {
      'with original function (wraps original function to save history)': function(test) {
        var originalFn = User.find;

        var mock = mocker.mock(User, 'find');

        test.same(User.find(3).id, 3);

        test.done();
      },

      'with custom function': function(test) {
        var mock = mocker.mock(User, 'find', function() {
          return 'mocked';
        });

        test.same(User.find(), 'mocked');

        test.done();
      },
    },
    
    'for instance method': {
      'maintains correct scope': function(test) {
        var user = new User('Lana Kang');
        
        var mock = mocker.mock(user, 'fullName', function(prefix, suffix) {
          return prefix + ' mocked ' + suffix;
        });
        
        test.same(user.fullName('test', 123), 'test mocked 123');
        test.same(user.fullName('test2', '!'), 'test2 mocked !');
        test.same(mock.timesCalled(), 2);

        test.done();
      }
    }
  },
  
  'mock.restore()': {
    'restores the original method': function(test) {
      var originalFn = User.find,
          mockFn = function() { return 'mocked!'; };

      var mock = mocker.mock(User, 'find', mockFn);

      mock.restore();

      test.same(User.find, originalFn);
      test.same(User.find(3).id, 3);

      test.done();
    }
  },
 
  'mock.lastArgs() returns the arguments the function was called with': {
    'with original function': function(test) {
      var mock = mocker.mock(User, 'find');

      User.find(123, 'X');
      test.same(mock.lastArgs(), [123, 'X']);

      User.find(456, 'Y');
      test.same(mock.lastArgs(), [456, 'Y']);

      test.done();
    },
    
    'with custom function': function(test) {
      var mock = mocker.mock(User, 'find', function() {
        return 'bla';
      });

      User.find(333, 'A');
      test.same(mock.lastArgs(), [333, 'A']);

      User.find(555, 'B');
      test.same(mock.lastArgs(), [555, 'B']);

      test.done();
    }
  },
  
  'mock.timesCalled() returns the number of times the function was called': {
    'with original function': function(test) {
      var mock = mocker.mock(User, 'find');

      User.find(1);
      User.find(2);
      User.find(3);

      test.same(mock.timesCalled(), 3);

      test.done();
    },

    'with custom function': function(test) {
      var mock = mocker.mock(User, 'find', function() {
        return 'bla';
      });

      User.find(1);
      User.find(2);
      User.find(3);
      User.find(1);
      User.find(2);

      test.same(mock.timesCalled(), 5);

      test.done();
    }
  },  
};