var debug = require('debug')('connector/mssql');
var sql = require('mssql');

// CONNECTOR FOR MSSQL
// -------------------------------------------------
var mssql = {

  // public members
  // ------------------------------------------------
  Request: sql.Request,

  Bit: sql.Bit,
  BigInt: sql.BigInt,
  Decimal: sql.Decimal, // ([precision], [scale])
  Float: sql.Float,
  Int: sql.Int,
  Money: sql.Money,
  Numeric: sql.Numeric, // ([precision], [scale])
  SmallInt: sql.SmallInt,
  SmallMoney: sql.SmallMoney,
  Real: sql.Real,
  TinyInt: sql.TinyInt,

  Char: sql.Char, // ([length])
  NChar: sql.NChar, // ([length])
  Text: sql.Text,
  NText: sql.NText,
  VarChar: sql.VarChar, // ([length])
  NVarChar: sql.NVarChar, // ([length])
  Xml: sql.Xml,

  Time: sql.Time, // ([scale])
  Date: sql.Date,
  DateTime: sql.DateTime,
  DateTime2: sql.DateTime2, // ([scale])
  DateTimeOffset: sql.DateTimeOffset, // ([scale])
  SmallDateTime: sql.SmallDateTime,

  UniqueIdentifier: sql.UniqueIdentifier,

  Variant: sql.Variant,

  Binary: sql.Binary,
  VarBinary: sql.VarBinary, // ([length])
  Image: sql.Image,

  UDT: sql.UDT,
  Geography: sql.Geography,
  Geometry: sql.Geometry,

  // public methods
  // ------------------------------------------------

  GetRequest : getRequest,
  GetTransaction: getTransaction
};



function getRequest(conn, cb) {

}

function getTransaction(conn, cb) {

}


module.exports = mssql;