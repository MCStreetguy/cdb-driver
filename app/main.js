// const ChildProcess = require('child_process');
const { btoa } = require('Base64');
const _isset = require('isset-helper');

class CDBDriver {

  constructor(config) {
    if(_isset(config,'object')) {
      if(_isset(config.host,'string') && _isset(config.port,'number')) {
        this.host = config.host + ':' + config.port;
      } else {
        throw new TypeError('CDBDriver configuration is missing required keys!');
      }

      if(_isset(config.user,'string') && _isset(config.pass,'string')) {
        this._auth = true;
        this.user = config.user;
        this.pass = config.pass;
      } else {
        this._auth = false;
      }
    } else if(_isset(config,'string')) {
      try {
        if(config.includes('@')) {
          this._auth = true;
          var tmp = config.split('@');
          var protocol = tmp[0].split('//')[0] + '//';
          var credentials = tmp[0].split('//')[1];
          this.user = credentials.split(':')[0];
          this.pass = credentials.split(':')[1];
          this.host = protocol + tmp[1].split(':')[0] + ':' + parseInt(tmp[1].split(':')[1]);
        } else {
          this._auth = false;
          this.host = config;
        }
      } catch(e) {
        throw new TypeError('An error occurred while parsing CouchDB URL string.');
      }
    } else {
      throw new TypeError('Invalid configuration passed to CDBDriver constructor!');
    }

    if(!this.host.endsWith('/')) {
      this.host = this.host + '/';
    }

    try {
      new XMLHttpRequest();
      this._mode = 'xhr';
    } catch (e) {
      this._mode = 'curl';
      throw new Error('CDBDriver currently not supports CURL mode!');
    }
  }

  _getAuthHeader() {
    return 'Basic ' + btoa(this.user + ':' + this.pass);
  }

  _setAuthHeader(request) {
    return request.setRequestHeader('Authorization',this._getAuthHeader());
  }

  _buildCURL(options) {
    var tmp = 'curl ';

    if(_isset(options.method,'string')) {
      tmp += '-X ' + options.method + ' ';
    } else {
      tmp += '-X GET ';
    }

    if(options.verbose) {
      tmp += '-v '
    }

    if(_isset(options.data,'object')) {
      tmp += '-H "Content-Type: application/json" ';
      tmp += '-d "' + JSON.stringify(options.data) + '" ';
    } else if(_isset(options.data,'string')) {
      tmp += '-d "' + options.data + '"';
    }

    if(this._auth) {
      tmp += '-H "Authorization: ' + this._getAuthHeader() + '" ';
    }

    if(_isset(options.location,'string')) {
      tmp += this.host + options.location;
    } else {
      tmp += this.host;
    }

    return tmp;
  }

  _parseCURLResponse(response,verbose) {
    var result, tmp;
    if(!verbose) {
      try {
        result = JSON.parse(response);
      } catch (e) {
        return response;
      } finally {
        return result;
      }
    } else {
      result = {};
      tmp = '';

      response.split('\n').forEach(function (e,i,a) {
        if(e.startsWith('*')) {
          // Connection info -> discard
        } else if(e.startsWith('>')) {
          // Request header -> discard
        } else if(e.startsWith('<')) {
          var info = e.replace('< ','');
          if(e.includes('HTTP/')) {
            result.code = parseInt(e.replace(new RegExp('HTTP\/[^\s]+ '),''));
          }
        } else {
          tmp += e;
        }
      })

      try {
        result.body = JSON.parse(tmp);
      } catch (e) {
        result.body = tmp;
      } finally {
        return result;
      }
    }
  }

  info(callback) {
    var _this = this;

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          callback({
            state: req.status,
            response: req.response
          })
        });

        req.open('GET',this.host);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host,false);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();

        return {
          state: req.status,
          response: req.response
        }
      }
    } else {
      // if(_isset(callback,'function')) {
      //   ChildProcess.exec(this._buildCURL({verbose: true}),{windowsHide: true},function (err,stdout,stderr) {
      //     if(!err) {
      //       var parsed = _this._parseCURLResponse(stdout);
      //       callback({
      //         state: parsed.code,
      //         response: parsed.body
      //       })
      //     } else {
      //       callback(null);
      //     }
      //   })
      // } else {
      //   var stdout = ChildProcess.execSync(this._buildCURL({verbose: true}),{windowsHide: true});
      //   var parsed = this._parseCURLResponse(stdout);
      //
      //   return {
      //     state: parsed.code,
      //     response: parsed.body
      //   }
      // }
    }
  }

  allDbs(callback) {
    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          callback({
            state: req.status,
            response: req.response
          })
        })

        req.open('GET',this.host + '_all_dbs');
        if(this._auth) req = this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host + '_all_dbs', false);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();

        return {
          state: req.status,
          response: req.response
        }
      }
    } else {
      // CURL
      if(_isset(callback,'function')) {
        // Async
      } else {
        // Sync
      }
    }
  }

  getDb(dbIdentifier,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.db() is missing required argument: dbIdentifier!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          callback({
            state: req.status,
            response: req.response
          })
        })

        req.open('GET',this.host + dbIdentifier);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host + dbIdentifier,false);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();

        return {
          state: req.status,
          response: req.response
        }
      }
    } else {}
  }

  createDb(dbIdentifier,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.createDb() is missing required argument: dbIdentifier!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          callback({
            state: req.status,
            response: req.response
          })
        })

        req.open('PUT',this.host);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();
      } else {
        req.open('PUT',this.host + dbIdentifier,false);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();

        return {
          state: req.status,
          response: req.response
        }
      }
    } else {}
  }

  getDocs(dbIdentifier,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.getDocs() is missing required argument: dbIdentifier!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          callback({
            state: req.status,
            response: req.response
          })
        })

        req.open('GET',this.host + dbIdentifier + '/_all_docs');
        if(this._auth) req = this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host + dbIdentifier + '/_all_docs',false);
        if(this._auth) req = this._setAuthHeader(req);
        req.send();

        return {
          state: req.status,
          response: req.response
        }
      }
    } else {}
  }

  storeDoc(dbIdentifier,data,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.storeDoc() is missing required argument: dbIdentifier!');
    }

    if(_isset(data,'object')) {
      data = JSON.stringify(data);
    } else if(!_isset(data,'string')) {
      throw new Error('CDBDriver.storeDoc() is missing required argument: data!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          callback({
            state: req.status,
            response: req.response
          })
        })

        req.open('POST',this.host + dbIdentifier);
        if(this._auth) req = this._setAuthHeader(req);
        req.send(data);
      } else {
        req.open('POST',this.host + dbIdentifier,false);
        if(this._auth) req = this._setAuthHeader(req);
        req.send(data);

        return {
          state: req.status,
          response: req.response
        }
      }
    } else {}
  }
}

try {
  module.exports = CDBDriver;
} catch(e) {}
