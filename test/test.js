var Molecule = require("../molecular");
var assert   = require('assert');
var self     = this;

describe('Environment', function() {
  it('should set the env variable to "node"', function() {
    var env = (self.window) ? env = "browser" : "node";
    assert.equal('node', env);
  });
});

describe('Connections', function() {
  describe('connect', function () {

    it('should connect to APIs when there is object in parameter', function () {
      Molecule.connect({
        'Github': 'api.github.com'
      });
      assert.equal('api.github.com', Molecule.connections.Github.base);
    });

    it('should connect to multiple APIs when there is object in parameter', function () {
      Molecule.connect({
        'Github': 'api.github.com',
        'Slack': 'api.slack.com'
      });
      assert.equal('api.github.com', Molecule.connections.Github.base);
      assert.equal('api.slack.com', Molecule.connections.Slack.base);
    });

    it('should return false when an api is not correctly defined', function () {
      var t = Molecule.connect({
        'Github': 'api.github.com',
        'Slack': {
          a: "test",
          b: "test",
          c: "test"
        }
      });
      assert.equal(false, t);
    });

    it('should return false when parameter is not an object', function () {
      var t = function() {};
      assert.equal(false, Molecule.connect('simple string'));
      assert.equal(false, Molecule.connect(123));
      assert.equal(false, Molecule.connect(2.4));
      assert.equal(false, Molecule.connect(t));
    });

  });

  describe('Use an API', function () {

    it('should return API object when chose an API', function () {
      assert.equal('api.github.com', Molecule.to('Github').base);
    });

    it('should return an error when api doesn\'t exist and log the error', function () {
      assert.equal(false, Molecule.to('Unknown'));
    });
  });
});


describe('Change API properties', function() {

  it('should change the api base', function () {
    Molecule.to('Github').setBase('https://api.github.com');
    assert.equal('https://api.github.com', Molecule.to('Github').base);
  });

  it('should return false when the base isn\'t a string', function () {
    assert.equal(false, Molecule.to('Github').setBase(123));
    assert.equal('https://api.github.com', Molecule.to('Github').base);
  });

  it('should add or change option to the api', function () {
    var optionA = {
      a: 'header 1',
      b: 'header 2'
    };
    
    var optionB = true;

    Molecule.to('Github').setOptions({
      something: optionA,
      else: optionB
    });

    assert.equal(optionA, Molecule.to('Github').options.something);
    assert.equal(optionB, Molecule.to('Github').options.else);
    assert.equal(undefined, Molecule.to('Github').options.other);
  });

});

describe('Send Http Request - nodejs environment', function() {
  describe('#GET request', function() {

    it('should return callback object with success, error, progress', function () {
      var req =  Molecule.to('Github').get('/some/endpoint');
      assert.equal("function", typeof req.success);
      assert.equal("function", typeof req.progress);
      assert.equal("function", typeof req.error);
    });

    it('should return a success callback with data', function () {
      Molecule.to('Github').setBase('api.github.com').get('/users/arthurmialon/events')
        .success(function(data, req) {
          if (data && req) {
            done();
          }
        });
    });

    it('should return a, error callback with err', function () {
      Molecule.to('Github').setBase('api.github.com').get('/users/arthurmialon/events/efezfj/efizej/eifezf')
        .error(function(err) {
          if (err) {
            done();
          }
        });
    });

  });

});
