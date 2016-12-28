'use strict';

var debug = require('debug')('connector/mssql');
var delegator = require('../delegator/kerberos.js');
var sql = require('mssql');


var mssql = {
  Request: sql.Request,
  Int: sql.Int,
  VarChar: sql.VarChar,

  getConnection: getConnection
};


/**
 *
 * @param Config
 * {dbms, server, port, database, username, password}
 *
 * @returns Connection
 */
function getConnection(config, cb) {
  var conn = new sql.Connection(config).connect(function connect(err) {
      if (err) {
        // TODO: error handling 추가
        debug('Exception occurs while connect().');
        debug(err);

        cb(err);
      } else {
        // TODO: connect 성공에 대한 handling 추가
        debug('Successfully Connected.');
        debug('-----------------------');
        debug('Server: ' + config.server);
        debug('Database: ' + config.database);

        cb(null, conn);
      }
    });
}




module.exports = mssql;