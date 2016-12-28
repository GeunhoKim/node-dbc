'use strict';

var debug = require('debug')('delegator/kerberos');
//var config = require('config');
//var kerberos = require('kerberos');
var restify = require('restify-clients');

var pjson = require('../../package.json');
var os = require('os');
var serviceConfig = require('./service-conig.json');
serviceConfig.userAgent = 'DCM-Client/' + pjson.version + ' (' + os.type() + '; ' + os.release() + '; '
  + os.platform() + ')  NodeJS/' + process.versions.node;
var client = restify.createJsonClient(serviceConfig);

var delegator = {
  requestConnectionString: requestConnectionString,

};

/**
 *
 * @param applicationName
 * @param connectionName
 */
function requestConnectionString(applicationName, connectionName, cb) {
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