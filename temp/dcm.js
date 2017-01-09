var debug = require('debug')('dcm');
var util = require('util');
var events = require('events');

var maria = require('./lib/connector/maria');
var pools = require('./lib/pools.js');

// DCM APPLICATION MODULE
// -------------------------------------------------------
var dcm = {
  isInitialized: false,
  isInitializing: false,

  Init: init,
  Query: query
};

/**
 * Initialize DCM
 * @param Config {applicationName, connectionNames}
 */
function init(config, cb) {
  dcm.isInitialized = false;
  dcm.isInitializing = true;
  /*
   {
     "applicationName": "DCM_TEST",
     "connectionNames": ["dcmtest_read", "dcmtest_write"],

     // 특정 연결 정보가 설정 파일에 명시되어 있으면, 해당 이름으로 연결풀 생성. (dev용)
     "connections": [
         {
           "connectionName": "dcmtest_read",
           "connection": {
             "dbms": "MARIA",
             "server": "localhost"
             , "port": "3306"
             , "database": "testdb"
             , "username": "root"
             , "password": ""
           }
         }, ...]
   }
   */
  // TODO: web service client에서 연결 문자열 응답을 받아 저장.

  var connStr = {
    "dbms": "MARIA",
    "server": "localhost"
    , "port": "3306"
    , "database": "testdb"
    , "username": "root"
    , "password": ""
  };

  for(var idx in config.connectionNames) {
    var connName = config.connectionNames[idx];

    pools.AddConnection(connName, connStr, function(err, msg) {
      if(err) {
        debug('error occurs while add a connection. %O', err.stack);
      } else {
        debug('add connection successfully. %O', msg);
      }

      if(idx == config.connectionNames.length - 1) {
        dcm.isInitializing = false;
        dcm.isInitialized = true;
        cb('initialize complete.');
      }
    });
  }

  // TODO: dev용 연결 문자열 정보 입력시 추가. 위 for 구문 무시.
}

/**
 *
 * @param Connection Name
 * @param Query String
 * @param Parameters {Object} or [List]
 * @param Callback
 */
function query(connName, query, param, cb) {
  var conn = pools.GetConnection(connName);

  conn.acquire().then(function(client) {
    maria.Query(client, query, param, function(err, rows) {
      cb(err, rows);
    });

    client.end();
    conn.release(client);
    
  }).catch(function(err) {
    cb(err, null);
  });
}

module.exports = dcm;