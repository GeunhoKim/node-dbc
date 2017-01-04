'use strict';

var debug = require('debug')('delegator');
//var kerberos = require('kerberos');
var restify = require('restify-clients');
var os = require('os');

var pjson = require('../package.json');
var serviceConfig = require('./config/delegator.json');
serviceConfig.userAgent = 'DCM-Client/' + pjson.version + ' (' + os.type() + '; ' + os.release() + '; '
  + os.platform() + ')  NodeJS/' + process.versions.node;

var client = restify.createJsonClient(serviceConfig);

var delegator = {
  GetConnectionString: getConnectionString

};

/**
 *
 * @param applicationName
 * @param connectionName
 */
function getConnectionString(applicationName, connectionName, cb) {
  var path = '/api/Connection/' + applicationName + '/' + connectionName;
  client.get(path, function(err,  req, res, obj) {
    if (err) { cb(err, res); }
    else {
      var result = {
        dbms: res.dbmsName,
        server: res.server,
        port: res.port,
        database: res.database,
        username: res.username,
        password: res.password
      };

      cb(null, result);
    }
  });
}

module.exports = delegator;