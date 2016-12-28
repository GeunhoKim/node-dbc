/**
 * Created by gkhim on 2016-10-11.
 */

'use strict';

var delegator = require(__base + 'lib/delegator/kerberos.js');
var mssql = require('./mssql.js');
var oracledb = require('./oracledb.js');

function Connector() {
}



module.exports = exports = new Connector();