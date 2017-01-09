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
var config = {
  "server": "localhost"
  , "port": "3306"
  , "database": "kktadb"
  , "username": "kktauser"
  , "password": "kktauser"
};

var connName = 'alkimtalk';
pools.AddConnection(connName, config, function(err, conn) {
  if(err) debug('error occurs while add a connection. %O', err.stack);
  else debug('add connection successfully. %O', conn);
});

var conn = pools.GetConnection(connName);

conn.acquire().then(function(client) {
  maria.Query(client, 'SELECT * FROM ata_mmt_log_201701 WHERE sender_key = :key'
  , {key: '6496db376cfa8dbea72a3e8baed6f13e53aa21ae'}, function(err, rows) {
      if (err) console.error(err);
      else console.dir(rows);
    });

  conn.release(client);
});