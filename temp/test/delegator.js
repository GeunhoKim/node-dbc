var assert = require('assert');
var config = require('./config.json');

// TARGET MODULE
// -----------------------------------------------------------------------
var delegator = require('../lib/delegator');


// DELEGATOR - KERBEROS SPNEGO TEST
// -----------------------------------------------------------------------
describe('delegator', function() {

  describe('#GetConnectionString("DCM_TEST", "testdb_read", cb)', function() {
    it('should get response from dcm web service without error.', function(done) {
      delegator.Init(config['dcm-test']['dcmService']);
      delegator.GetConnectionString('DCM_TEST', 'testdb_read', done);
    })
  });
});