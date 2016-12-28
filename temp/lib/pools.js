/**
 * Created by gkhim on 2016-10-11.
 */

'use strict';

var HashMap = require('hashmap');
var mssql = require('mssql');
var oracle = require('oracledb');

var _conn = new HashMap();

// 임시
// kerberos를 통해 어플리케이션명 + 연결이름으로 아래와 같은 연결 정보를 얻는다.
var config = {
  user: 'pdprofile',
  password: 'ppf',
  server: 'bcdb3',
  database: 'ArcheAccount'
};

module.exports = {
  getConnectionPool: function getConnectionPool(connectionName) {
    return _conn.get(connectionName);
  }
}

Object.defineProperties(
  pools,
  {


  }
);