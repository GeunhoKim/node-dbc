var debug = require('debug')('pools');
var hashmap = require('hashmap');
var sql = require('mssql');
//var oracle = require('oracledb');
var maria = require('mariasql');
var gpool = require('generic-pool');

var constants = require('./constants.js');

var _conns = new hashmap(); // store connections
var _connmap = new hashmap(); // store dbms type

// -----------------------------------------------------------------------
// Pools
// Connection을 관리하는 Pool.
// 사용자가 명시한 어플리케이션명과 연결 문자열명을 통해 connection을 생성하고
// 관리한다.
const pools = {

  AddConnection: addConnection,
  GetConnection: getConnection,
  CloseConnection: closeConnection

};

// delegator를 통해 어플리케이션명 + 연결이름으로 아래와 같은 연결 정보를 얻는다.
// temp connstr
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

// -----------------------------------------------------------------------
// public functions
/**
 *
 * @param Connection Name
 * @param Config {dbms, server, port, db, username, password}
 * @param Callback
 */
function addConnection(connName, config, cb) {
  var dbmsEnum = constants.GetDbmsEnum(config.dbms);
  _connmap.set(connName, config.dbms);

  switch(dbmsEnum){
    case constants.dbmsEnums.MSSQL:
      addMSSQLConnection(connName, config, cb);
      break;

    case constants.dbmsEnums.MARIA:
      addMariaConnection(connName, config, cb);
      break;

    case constants.dbmsEnums.ORACLE:
    default:
      addOracleConnection(connName, config, cb);
      break;
  }
}

/**
 *
 * Connection 연결 닫기 및 연결풀에서 제거
 * @param Connection Name
 * @param callback
 */
function closeConnection(connName, cb) {

  if (!_conns.has(connName) || !_connmap.has(connName))
    return;

  var conn = _conns.get(connName);
  var dbms = _connmap.get(connName);

  var dbmsEnum = constants.GetDbmsEnum(dbms);

  switch(dbmsEnum) {
    case constants.dbmsEnums.MARIA:
      conn.destroy();
      break;

    case constants.dbmsEnums.ORACLE:
    case constants.dbmsEnums.MSSQL:
    default:
      break;
  }

  _conns.remove(connName);
}

/**
 *
 * @param Connection Name
 * @returns Connection
 */
function getConnection(connName) {
  var connection = null;

  if(_conns.has(connName)) {
    connection = _conns.get(connName);
  }

  return connection;
}


// -----------------------------------------------------------------------
// private functions
/**
 * MSSQL Connection 객체 생성 및 연결
 * @parma Connection Name
 * @param Config {server, port, db, username, password}
 * @parma Callback
 */
function addMSSQLConnection(connName, config, cb) {

  var dbmsEnum = constants.GetDbmsEnum(config.dbms);

  cb(new Error('NotImplementedException'),
    '아직 지원하지 않는 DBMS 입니다. [' + constants.dbmsStrs[dbmsEnum] + ']');

  /*
  var conn = new sql.Connection(config);

  // mssql client 는 query 수행 전 직접 connection을 맺어줘야 함.
  // 맺어지지 않은 connection으로 query 수행시 에러를 반환함.
  // mssql의 Connection 객체는 실제로는 pool 임에 주의.

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

      _conns.set(connName, conn);

      cb(null, '연결 성공. [' + connName + ']');
    }
  });
  */
}

/**
 * Oracle Connection 객체 생성
 * @param Conection Name
 * @param Config
 * @param Callback
 */
function addOracleConnection(connName, config, cb) {
  var dbmsEnum = constants.GetDbmsEnum(config.dbms);

  cb(new Error('NotImplementedException'),
    '아직 지원하지 않는 DBMS 입니다. [' + constants.dbmsStrs[dbmsEnum] + ']');
}

/**
 * Maria Connection 객체 생성
 * @param Connection Name
 * @param Config {server, port, db, username, password}
 * @param Callback
 */
function addMariaConnection(connName, config, cb) {
  var _config = {
    host: config.server,
    port: config.port,
    db: config.database,
    user: config.username,
    password: config.password,
    charset: 'utf8'
  };

  const factory = {
    create: function() {
      return new Promise(function(resolve, reject) {
        var client = new maria(_config);

        client.on('error', function(err) {
          debug('Exception occurs on maria: %O', err.stack);
        });

        resolve(client);
      })
    },
    destroy: function(client){
      return new Promise(function(resolve) {

        client.on('close', function() {
          resolve('maria client 가 정상적으로 종료 되었습니다.');
        });

        client.close();
      });
    }
  };

  var conn = gpool.createPool(factory, { max: 10, min: 3, idleTimeoutMillis : 30000 });

  // mariasql client 는 직접 connection 연결을 할 필요가 없음.
  // query 수행시 알아서 연결을 맺음. 즉, pool이 아닌 단일 connection임.
  // pool 기능을 위해 generic-pool로 관리.

  _conns.set(connName, conn);

  cb(null, '연결 성공. [' + connName + ']');
}

process.on('exit', function() {

});

module.exports = pools;