'use strict';

var delegator = require("../lib/delegator/kerberos.js");
var mssql = require("../lib/connector/mssql.js");

//delegator.requestConnectionString("DCM_TEST", "gmkt_read", function(err, res) {
//  if(err) { console.log(err); }
//  else {

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
  //}
//});