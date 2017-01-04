'use strict';

var HashMap = require('hashmap');
var sql = require('mssql');
var oracle = require('oracledb');

var _conn = new HashMap();

var pools = {


};

// delegator를 통해 어플리케이션명 + 연결이름으로 아래와 같은 연결 정보를 얻는다.
var connstr = {
  user: 'pdprofile',
  password: 'ppf',
  server: 'bcdb3',
  database: 'ArcheAccount',
  pool: {
    max: 100,
    min: 0
  }
};

/**
 *
 * MSSQL Connection 객체 생성 및 연결
 * @param Config
 * {dbms, server, port, database, username, password}
 *
 * @returns Connection
 */
function getConnection(config, cb) {
  var conn = new sql.Connection(config);
  conn.connect(function res_connect(err) {
    if (err) {
      // TODO: error handling 추가
      debug('Exception occurs while connect().');
      debug(err);

      cb(err, 'db 연결 중 에러 발생');
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

module.exports = pools;