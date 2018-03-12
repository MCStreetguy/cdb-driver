title: CDBDriver
description: A driver library for connecting to a CouchDB instance through JavaScript.

# CouchDB Driver
**A driver library for connecting to a CouchDB instance through JavaScript.**

[![GitHub stars](https://img.shields.io/github/stars/mcstreetguy/cdb-driver.svg?style=social&logo=github&label=Stars)](https://github.com/MCStreetguy/cdb-driver)
![NPM Downloads](https://img.shields.io/npm/dt/cdb-driver.svg)
[![GitHub package version](https://img.shields.io/github/package-json/v/mcstreetguy/cdb-driver.svg)](https://www.npmjs.com/package/cdb-driver)
![NPM License](https://img.shields.io/npm/l/cdb-driver.svg)
[![GitHub issues](https://img.shields.io/github/issues/mcstreetguy/cdb-driver.svg)](https://github.com/MCStreetguy/cdb-driver/issues)
![GitHub last commit](https://img.shields.io/github/last-commit/mcstreetguy/cdb-driver.svg)

CouchDB seems the perfect database for JavaScript applications since it uses
JSON as data structure. On first sight, this makes it really easy to interact
with a CouchDB instance. But endless encapsulation of asynchroneous requests
and their callbacks gets annoying fast.

Thus this library provides both, asynchroneous and synchroneous methods.
Performing synchroneous requests on the main thread is deprecated and should not
be used in production environments, even if its provided by this library.

## Installation
**Via package manager:**

``` bash
$ npm install --save cdb-driver
# or
$ yarn add cdb-driver
```

**Via CDN / JSDelivr:**

``` bash
https://cdn.jsdelivr.net/npm/cdb-driver@[version]
# or
https://cdn.jsdelivr.net/npm/cdb-driver@[version]/dist/main.min.js
```
Replace [version] with a semver-string just as used in npm.

**Manually:**

You can also install it by [downloading the minified source](https://raw.githubusercontent.com/MCStreetguy/cdb-driver/master/dist/main.min.js)
and including it however you like (whyever you should do this).

## Usage
First require the module:
``` javascript
const CDBDriver = require('cdb-driver')
```

!!! info
    When using this library within a webpage directly instead of Node.js, you can leave this step out.
    The CDBDriver class will be registered on the window object and is available for all following scripts.


Then initiate a new instance through one of the following methods.

**Using configuration object:**
``` javascript
var driver = new CDBDriver({
  host: 'http://localhost:5984/',
  user: 'admin',
  pass: 'p4ssw0rd'
})
```

The `user` and `pass` keys can be omitted, if no authentication is needed.

**Using configuration string:**
``` javascript
var driver = new CDBDriver('http://admin:p4ssw0rd@localhost:5984/');
```

The URL string gets parsed internally to a configuration object, thus both
methods result in the same instance at the end.

## Here you go
That's all, you're up and running. Continue with the [Reference page](/reference) to get known to the available methods.
