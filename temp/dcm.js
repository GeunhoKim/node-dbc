var debug = require('debug')('dcm');
var hashmap = require('hashmap');

var maria = require('./lib/connector/maria');
var pools = require('./lib/pools.js');
var delegator = require('./lib/delegator');

var constants = require('./lib/constants');


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
 * @prama Callback
 */
function init(config, cb) {
  dcm.isInitialized = false;
  dcm.isInitializing = true;

  var connections = config["connections"];

  if (connections) { initFromConnectionsConfig(connections, cb); }
  else {
    var dcmService = config['dcmService'];

    if(!dcmService)
      cb(new Error('dcmService 설정이 부족합니다. 파라미터를 다시 확인 하십시오.'), null);

    delegator.Init(dcmService);
    initFromWebService(config, cb);
  }
}

/**
 *
 * @param ConnectionName
 * @param QueryString
 * @param Parameters {Object} or [List]
 * @param Callback {Error, [Rows]}
 */
function query(connName, query, param, cb) {
  if(typeof param === 'function') cb = param;

  var dbmsType = pools.GetDbmsType(connName);
  var dbmsEnum = constants.GetDbmsEnum(dbmsType);

  switch(dbmsEnum) {
    case constants.dbmsEnums.MARIA:
      queryMaria(connName, query, param, cb);
      break;

    case constants.dbmsEnums.MSSQL:
      queryMSSQL(connName, query, param, cb);
      break;

    case constants.dbmsEnums.ORACLE:
      queryOracle(connName, query, param, cb);
      break;
  }
}

// PRIVATE FUNCtiONS
// -------------------------------------------------------
function initFromConnectionsConfig(conns, cb) {
  /*
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
   , "options": { max: 10, idleTimeoutMillis : 30000 }
   }
   }, ...]
   */

  for(idx = 0; idx < conns.length; idx++) {
    var conn = conns[idx];
    var connName = conn.connectionName;
    var connObj = conn.connection;

    pools.AddConnection(connName, connObj, function(err, msg) {
      if(err) {
        debug('error occurs while add a connection. %O', err.stack);
        cb(err, 'Exception occurs while initializing.');
        return;
      } else {
        debug('add connection successfully. %O', msg);
      }

      if(idx === conns.length - 1) {
        dcm.isInitializing = false;
        dcm.isInitialized = true;
        cb(null, 'initialize complete.');
      }
    });
  }
}

function initFromWebService(config, cb) {

  // TODO: web service client에서 연결 문자열 응답을 받아 저장.

  var connObj = {
    "dbms": "MARIA",
    "server": "localhost"
    , "port": "3306"
    , "database": "testdb"
    , "username": "root"
    , "password": ""
  };

  var options = config['options'];
  if(options) connObj.options = options;

  for(var idx in config.connectionNames) {
    var connName = config.connectionNames[idx];

    delegator.GetConnectionString(config.applicationName, connName, function(err, connObj) {
      if (err) cb(err, null);
      else {
        pools.AddConnection(connName, connObj, function (err, msg) {
          if (err) {
            debug('error occurs while add a connection. %O', err.stack);
          } else {
            debug('add connection successfully. %O', msg);
          }

          if (idx == config.connectionNames.length - 1) {
            dcm.isInitializing = false;
            dcm.isInitialized = true;
            cb('initialize complete.');
          }
        });
      }
    });
  }
}

function queryMaria(connName, query, param, cb) {
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

function queryMSSQL(connName, query, param, cb) {
  cb(new Error('NotImplementedException'), null);
}

function queryOracle(connName, query, param, cb) {
  cb(new Error('NotImplementedException'), null);
}

module.exports = dcm;