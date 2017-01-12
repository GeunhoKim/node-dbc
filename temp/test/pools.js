var assert = require('assert');
var config = require('./config.json');

// TARGET MODULE
// -----------------------------------------------------------------------
var pools = require('../lib/pools');


// POOLS TEST
// -----------------------------------------------------------------------
describe('pools', function() {
  
  describe('#AddConnection("testdb_read", config, cb)', function() {
    it('should add "testdb_read" connection without error.', function(done) {
      pools.AddConnection('testdb_read', config['maria-test-pool'], done)
    })
  });

  describe('#GetConnection("testdb_read")', function() {
    it('should return testdb_read connection pool without error.', function() {
      assert.notEqual(null, pools.GetConnection('testdb_read'), 'testdb_read pool is null.');
    })
  });

  describe('#GetDbmsType("testdb_read")', function() {
    it('should be MARIA.', function() {
      assert.equal('MARIA', pools.GetDbmsType('testdb_read'))
    })
  });

  describe('#CloseConnection("testdb_read", cb)', function() {
    it('should release connection pool without error.', function(done) {
      pools.CloseConnection('testdb_read', done);
    })
  });

  describe('#GetConnection("testdb_read")', function() {
    it('should return null because it is closed.', function() {
      assert.equal(null, pools.GetConnection('testdb_read'));
    })
  });
});