var debug = require('debug')('connector/maria');
var mariasql = require('mariasql');

// CONNECTOR FOR MARIASQL
// -------------------------------------------------
var maria = {
  Prepare: mariasql.prepare,

  Query: query
};

/**
 *
 * @param Connection, maria client object.
 * @param Callback
 */
function query(conn, queryStr, params, cb) {
  conn.query(queryStr, params, function(err, rows) {
    if (err) cb(err, null);
    else cb(null, rows);
  });

  conn.end();
}


module.exports = maria;
