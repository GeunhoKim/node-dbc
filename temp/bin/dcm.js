var debug = require('debug')('bin/dcm');
var mssql = require("../lib/connector/mssql");
var maria = require("../lib/connector/maria");
var pools = require("../lib/pools");


// MSSQL CLIENT
// ----------------------------------------------------------------
//delegator.requestConnectionString("DCM_TEST", "gmkt_read", function(err, res) {
//  if(err) { console.log(err); }
//  else {

/*
    var res = {
      user: 'pdprofile',
      password: 'ppf',
      server: 'bcdb3',
      database: 'ArcheAccount'
    };

    mssql.GetConnection(res, function res_GetConnection(err, conn) {
      console.log('success');

      var conn = conn;

      new mssql.Request(conn)
        .input('USERID', mssql.VarChar(20), 'gkhim')
        .execute('dbo.UPAR_API_Accounts_SelectAccounts')
        .then(function (recordsets) {
          console.dir(recordsets);
        }).catch(function (err) {
        console.log(err);
      });
    });
*/
  //}
//});

// MARIA CLIENT
// ----------------------------------------------------------------
/*
var config = {
  "dbms": "MARIA",
  "server": "localhost"
  , "port": "3306"
  , "database": "testdb"
  , "username": "root"
  , "password": ""
};

var connName = 'alkimtalk';
pools.AddConnection(connName, config, function(err, msg) {
  if(err) debug('error occurs while add a connection. %O', err.stack);
  else debug('add connection successfully. %O', msg);
});

var conn = pools.GetConnection(connName);

conn.acquire().then(function(client) {
  maria.Query(client, 'SELECT * FROM t1 WHERE id = :id', { id: 1 }, function(err, rows) {
      if (err) console.error(err);
      else console.dir(rows);
    });

  conn.release(client);
}).catch(function(err) {
  console.error(err);
});
*/

var config = {
  "applicationName": "DCM_TEST",
  "connectionNames": ["dcmtest_read", "dcmtest_write"]
};

var dcm = require('../dcm');

dcm.Init(config, function(msg) {
  debug('Init. %s', msg);

  dcm.Query('dcmtest_read', 'SELECT * FROM t1 WHERE id = :id', { id: 1 }, function(err, rows) {
    if(err) debug('error occurs. %O', err.stack);
    else debug('Success. %O', rows);
  });
});

if(dcm.isInitialized) {
  dcm.Query('dcmtest_read', 'SELECT * FROM t1', null, function(err, rows) {
    if(err) debug('error occurs. %O', err.stack);
    else debug('Success. %O', rows);
  });
}