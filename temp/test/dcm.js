var assert = require('assert');
var config = require('./config.json');

// TARGET MODULE
// -----------------------------------------------------------------------
var dcm = require('../dcm');

// DCM TEST
// -----------------------------------------------------------------------
describe('dcm', function() {

  before(function() {
    // TODO: create t1 table
    // TODO: insert test data into t1 table
  });

  after(function() {
    // TODO: drop t1 table
  });

  describe('#Init(config, cb)', function() {
    it('should init without error.', function(done) {
      dcm.Init(config['dcm-test'], done);
    })
  });

  describe('#Query("testdb_read", "SELECT COUNT(*) AS count FROM t1", cb)', function() {
    it('should execute without error.', function(done) {
      dcm.Query('testdb_read', 'SELECT COUNT(*) AS count FROM t1', done);
    })
  });
});