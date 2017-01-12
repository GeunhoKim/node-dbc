var debug = require('debug')('delegator/kerberos');

var url = require('url');
var util = require('util');
var krb5 = require('krb5');
var http = null;

var os = require('os');
var pjson = require('../package.json');
var serviceConfig = require('./config/delegator.json');
const userAgent = 'DCM-Client/' + pjson.version + ' (' + os.type() + '; ' + os.release() + '; '
+ os.platform() + ')  NodeJS/' + process.versions.node;


// DELEGATOR - KERBEROS SPNEGO
// ------------------------------------------------------------------------------------
var delegator = function(config) {
  /*
   {
   url: 'http://dcmservicedev.testebaykorea.corp,
   principal: 'archeadm@TESTEBAYKOREA.CORP',
   keytab: './archeadm.keytab'
   }
   */
  var argv = {
    url: 'http://dcmservicedev.testebaykorea.corp/api/connection/DCM_TEST/gmkt_read',
    principal: 'archeadm@TESTEBAYKOREA.CORP',
    keytab: './archeadm.keytab'
  };

  var options = url.parse(argv.url);
  http = require(options.protocol.substr(0, options.protocol.length - 1));

  if (options.protocol === 'https:') {
    options.rejectUnauthorized = false
  }

  var module = {

    GetConnectionString: getConnectionString

  };

  return module;
};



/**
 *
 * @param ApplicationName
 * @param ConnectionName
 * @param Callback {error, connObj}
 */
function getConnectionString(applicationName, connectionName, cb) {
  var path = '/api/Connection/' + applicationName + '/' + connectionName;

  http.get(options, function (res) {
    if (res.statusCode !== 401)
      cb(new Error('잘못된 요청입니다. DCM web service 설정을 확인 하십시오.'), null);

    res.on('readable', function () {
      while (chunk = res.read()) { }
    });

    krb5.spnego({
      principal: argv.principal,
      keytab: argv.keytab,
      service_principal: 'HTTP@' + options.hostname
    }, function (err, token) {
      if (err) { return process.stderr.write('ERROR[1]: ' + err.message + '\n'); }
      options.headers = {
        'Authorization': 'Negotiate ' + token,
        'User-Agent': userAgent
      };
      http.get(options, function (res) {
        // Read the HTTP response
        data = ''
        res.on('readable', function () {
          while (chunk = res.read()) {
            data += chunk.toString()
          }
        }).on('end', function () {
          process.stdout.write(util.inspect(JSON.parse(data), { depth: null, colors: true }));
        });
      }).on('error', function () {
        process.stderr.write('ERROR[2]: ' + err.message + '\n');
      });
    });
  }).on('error', function (err) {
    process.stderr.write('ERROR[3]: ' + err.message + '\n');
  });

}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

module.exports = delegator;