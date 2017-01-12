var debug = require('debug')('connector/maria');
var mariasql = require('mariasql');

// CONNECTOR FOR MARIASQL
// -------------------------------------------------
var maria = {

  Query: query,
  Prepare: prepare
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

function prepare(conn, queryStr, params) {
  return conn.prepare(queryStr)(params);
}

module.exports = maria;
