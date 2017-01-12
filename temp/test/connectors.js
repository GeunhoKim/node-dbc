var assert = require('assert');
var config = require('./config.json');

// TARGET MODULE
// -----------------------------------------------------------------------
var MariaClient = require('mariasql');
var mariaConn = new MariaClient(config["mariasql-test-connection"]);
var maria = require('../lib/connector/maria');

// MARIA CONNECTOR TEST
// -----------------------------------------------------------------------
describe('connector/maria', function() {

  before(function() {
    // TODO: create t1 table
    // TODO: insert test data into t1 table
  });

  after(function() {
    // TODO: drop t1 table
  });

  describe('#Query(conn, "SELECT * FROM t1 WHERE id = :id", {"id": 1}, cb)', function() {
    it('should execute without error.', function(done) {
      maria.Query(mariaConn, 'SELECT COUNT(*) as count FROM t1 WHERE id = :id', {"id": 1}, done);
    })
  });

  describe('#Prepare(conn, "SELECT * FROM t1 WHERE id = :id", {"id": 1})', function() {
    it('should equal SELECT * FROM t1 WHERE id = \'1\'.', function() {
      var ps = maria.Prepare(mariaConn, 'SELECT * FROM t1 WHERE id = :id', {"id": 1});
      assert.equal("SELECT * FROM t1 WHERE id = '1'", ps);
    })
  });
});