function _isset(test,type) {
  if(!type) {
    var _check = false;
  } else {
    var _check = true;
    try {
      var _instance = test instanceof type;
    } catch (e) {
      var _instance = false;
    }
    try {
      var _type = typeof test === type;
    } catch (e) {
      var _type = false;
    }
  }

  return (
    test != null &&
    test != undefined && (
      _check && (
        _instance ||
        _type
      )
    )
  );
}

class CDBDriver {
  constructor(config) {
    if(_isset(config,'object')) {
      if(_isset(config.host,'string') && _isset(config.port,'number')) {
        this.host = config.host;
        this.port = config.port;
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

          this.host = protocol + tmp[1].split(':')[0];
          this.port = parseInt(tmp[1].split(':')[1]);
        } else {
          this._auth = false;
          this.host = config.split(new RegExp(':(?!\/)'))[0];
          this.port = parseInt(config.split(new RegExp(':(?!\/)'))[1]);
        }
      } catch(e) {
        throw new TypeError('An error occurred while parsing CouchDB URL string.');
      }
    } else {
      throw new TypeError('Invalid configuration passed to CDBDriver constructor!');
    }
  }
}

try {
  module.exports = CDBDriver;
} catch(e) {}
