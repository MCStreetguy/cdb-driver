const btoa = require('btoa');
const _isset = require('isset-helper');

window.CDBDriver = class CDBDriver {

  constructor(config) {
    if(_isset(config,'object')) {
      if(_isset(config.host,'string')) {
        this.host = config.host;
      } else {
        throw new TypeError('CDBDriver configuration is missing required key: host!');
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

    var res = this.info().response;
    if(parseInt(res.version) < 2) {
      // throw new Error('Invalid CouchDB Version! Required version >= 2, found '+res.version+'.');
      this.legacy = true;
    } else {
      this.legacy = false;
    }
  }

  _getAuthHeader() {
    return 'Basic ' + btoa(this.user + ':' + this.pass);
  }

  _setAuthHeader(request) {
    request.setRequestHeader('Authorization',this._getAuthHeader());
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
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        });

        req.open('GET',this.host);
        if(this._auth) this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host,false);
        if(this._auth) this._setAuthHeader(req);
        req.send();

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
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
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('GET',this.host + '_all_dbs');
        if(this._auth) this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host + '_all_dbs', false);
        if(this._auth) this._setAuthHeader(req);
        req.send();

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
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
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('GET',this.host + dbIdentifier);
        if(this._auth) this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host + dbIdentifier,false);
        if(this._auth) this._setAuthHeader(req);
        req.send();

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
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
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('PUT',this.host);
        if(this._auth) this._setAuthHeader(req);
        req.send();
      } else {
        req.open('PUT',this.host + dbIdentifier,false);
        if(this._auth) this._setAuthHeader(req);
        req.send();

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
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
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('GET',this.host + dbIdentifier + '/_all_docs');
        if(this._auth) this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host + dbIdentifier + '/_all_docs',false);
        if(this._auth) this._setAuthHeader(req);
        req.send();

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
        }
      }
    } else {}
  }

  storeDoc(dbIdentifier,data,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.storeDoc() is missing required argument: dbIdentifier!');
    } else if(!_isset(data,'object')) {
      throw new Error('CDBDriver.storeDoc() is missing required argument: data!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('POST',this.host + dbIdentifier);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send(JSON.stringify(data));
      } else {
        req.open('POST',this.host + dbIdentifier,false);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send(JSON.stringify(data));

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
        }
      }
    } else {}
  }

  getDoc(dbIdentifier,docIdentifier,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.getDoc() is missing required argument: dbIdentifier!');
    } else if(!_isset(docIdentifier,'string')) {
      throw new Error('CDBDriver.getDoc() is missing required argument: docIdentifier!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('GET',this.host + dbIdentifier + '/' + docIdentifier);
        if(this._auth) this._setAuthHeader(req);
        req.send();
      } else {
        req.open('GET',this.host + dbIdentifier + '/' + docIdentifier,false);
        if(this._auth) this._setAuthHeader(req);
        req.send();

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
        }
      }
    } else {}
  }

  deleteDoc(dbIdentifier,docIdentifier,docRevision,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.deleteDoc() is missing required argument: dbIdentifier!');
    } else if(!_isset(docIdentifier,'string')) {
      throw new Error('CDBDriver.deleteDoc() is missing required argument: docIdentifier!');
    } else if(!_isset(docRevision,'string')) {
      throw new Error('CDBDriver.deleteDoc() is missing required argument: docRevision!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('DELETE',this.host + dbIdentifier + '/' + docIdentifier + '?rev=' + docRevision);
        if(this._auth) this._setAuthHeader(req);
        req.send();
      } else {
        req.open('DELETE',this.host + dbIdentifier + '/' + docIdentifier + '?rev=' + docRevision,false);
        if(this._auth) this._setAuthHeader(req);
        req.send();

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
        }
      }
    } else {}
  }

  updateDoc(dbIdentifier,docIdentifier,docRevision,data,callback) {
    if(!_isset(dbIdentifier,'string')) {
      throw new Error('CDBDriver.updateDoc() is missing required argument: dbIdentifier!');
    } else if(!_isset(docIdentifier,'string')) {
      throw new Error('CDBDriver.updateDoc() is missing required argument: docIdentifier!');
    } else if(!_isset(docRevision,'string')) {
      throw new Error('CDBDriver.updateDoc() is missing required argument: docRevision!');
    } else if(!_isset(data,'object')) {
      throw new Error('CDBDriver.updateDoc() is missing required argument: data!');
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('PUT',this.host + dbIdentifier + '/' + docIdentifier + '?rev=' + docRevision);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send(JSON.stringify(data));
      } else {
        req.open('PUT',this.host + dbIdentifier + '/' + docIdentifier + '?rev=' + docRevision,false);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send(JSON.stringify(data));

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
        }
      }
    } else {}
  }

  storeUser(options,callback) {
    if(!_isset(options.username,'string')) {
      throw new Error('CDBDriver.storeUser() is missing required argument: username!');
    } else if(!_isset(options.password,'string')) {
      throw new Error('CDBDriver.storeUser() is missing required argument: password!');
    }

    var data = {
      _id: 'org.couchdb.user:' + options.username,
      name: options.username,
      roles: (_isset(options.roles,'object') ? options.roles : []),
      type: 'user',
      password: options.password
    }

    if(_isset(options.additionals,'object')) {
      for (var key in options.additionals) {
        if(options.additionals.hasOwnProperty(key) && !data.hasOwnProperty(key)) {
          data[key] = options.additionals[key];
        }
      }
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('PUT',this.host + '_users/' + data._id);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send(JSON.stringify(data));
      } else {
        req.open('PUT',this.host + '_users/' + data._id,false);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send(JSON.stringify(data));

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
        }
      }
    } else {}
  }

  storeAdmin(username,password,callback) {
    if(!_isset(username,'string')) {
      throw new Error('CDBDriver.storeUser() is missing required argument: username!');
    } else if(!_isset(password,'string')) {
      throw new Error('CDBDriver.storeUser() is missing required argument: password!');
    }

    if(this.legacy) {
      var target = this.host + '_config/admins/' + username;
    } else {
      var target = this.host + '_node/_local/_config/admins/' + username;
    }

    if(this._mode == 'xhr') {
      var req = new XMLHttpRequest();
      if(_isset(callback,'function')) {
        req.addEventListener('load',function (event) {
          try {
            var response = JSON.parse(req.response);
          } catch (e) {
            var response = req.response;
          }

          callback({
            state: req.status,
            response: response
          })
        })

        req.open('PUT',target);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send('"' + password + '"');
      } else {
        req.open('PUT',target,false);
        if(this._auth) this._setAuthHeader(req);
        req.setRequestHeader('Content-Type','application/json');
        req.send('"' + password + '"');

        try {
          var response = JSON.parse(req.response);
        } catch (e) {
          var response = req.response;
        }

        return {
          state: req.status,
          response: response
        }
      }
    } else {}
  }
}
