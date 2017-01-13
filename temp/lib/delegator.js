var debug = require('debug')('delegator/kerberos');

var url = require('url');
var util = require('util');
const http = require('http');
const https = require('https');
var krb5 = require('krb5');

var os = require('os');
var pjson = require('../package.json');
const userAgent = 'DCM-Client/' + pjson.version + ' (' + os.type() + '; ' + os.release() + '; '
+ os.platform() + ')  NodeJS/' + process.versions.node;

var argv = null;

// DELEGATOR - KERBEROS SPNEGO
// ------------------------------------------------------------------------------------
var delegator = {
  /*
   {
   url: 'http://dcmservicedev.testebaykorea.corp,
   principal: 'archeadm@TESTEBAYKOREA.CORP',
   keytab: './archeadm.keytab'
   }
   */
  Init: init,
  GetConnectionString: getConnectionString

};

function init(config) {
  argv = config;
}

/**
 *
 * @param ApplicationName
 * @param ConnectionName
 * @param Callback {error, connObj}
 */
function getConnectionString(applicationName, connectionName, cb) {
  var path = '/api/Connection/' + applicationName + '/' + connectionName;

  var request = url.parse(argv.url + path);

  // target module. http or https
  var thttp = null;

  if (request.protocol === 'https:') {
    request.rejectUnauthorized = false;
    thttp = https;
  } else {
    thttp = http;
  }

  thttp.get(request, function (res) {
    if (res.statusCode !== 401)
      cb(new Error('잘못된 요청입니다. DCM web service 설정을 확인 하십시오.'), null);

    res.on('readable', function () {
      while (chunk = res.read()) { }
    });

    krb5.spnego({
      principal: argv.principal,
      keytab: argv.keytab,
      service_principal: 'HTTP@' + request.hostname
    }, function (err, token) {
      if (err) cb(err, null);

      request.headers = {
        'Authorization': 'Negotiate ' + token,
        'User-Agent': userAgent
      };

      thttp.get(request, function (res) {
        var data = '';

        res.on('readable', function () {
          while (chunk = res.read()) {
            data += chunk.toString();
          }
        }).on('end', function () {
          var data = JSON.parse(data);
          var result = {
            'dbms': data['dbmsName'],
            'server': data['server'],
            'port': data['port'],
            'database': data['database'],
            'username': data['username'],
            'password': data['password'],
            'connectionString': data['connectionString']
          };

          cb(null, result);
        });

      }).on('error', function () {
        cb(err, null);
      });

    });

  }).on('error', function (err) {
    cb(err, null);
  });
}

module.exports = delegator;