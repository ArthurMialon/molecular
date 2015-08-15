var Molecule = require("../molecular")();
var assert   = require('assert');

describe('Connections', function() {
  describe('connect', function () {

    it('should connect to APIs when there is object in parameter', function () {
      Molecule.connect({
        'Github': 'api.github.com'
      });
      assert.equal('api.github.com', Molecule.connections['Github'].base);
    });

    it('should connect to multiple APIs when there is object in parameter', function () {
      Molecule.connect({
        'Github': 'api.github.com',
        'Slack': 'api.slack.com'
      });
      assert.equal('api.github.com', Molecule.connections['Github'].base);
      assert.equal('api.slack.com', Molecule.connections['Slack'].base);
    });

    it('should return false when an api is not correctly defined', function () {
      var t = Molecule.connect({
        'Github': 'api.github.com',
        'Slack': {
          a: "test",
          b: "test"
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
});
