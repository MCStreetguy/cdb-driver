# CDBDriver
**A driver library for connecting to a CouchDB instance through JavaScript.**

[![GitHub stars](https://img.shields.io/github/stars/mcstreetguy/cdb-driver.svg?style=social&logo=github&label=Stars)](https://github.com/MCStreetguy/cdb-driver)
![NPM Downloads](https://img.shields.io/npm/dt/cdb-driver.svg)
[![GitHub package version](https://img.shields.io/github/package-json/v/mcstreetguy/cdb-driver.svg)](https://www.npmjs.com/package/cdb-driver)
![NPM License](https://img.shields.io/npm/l/cdb-driver.svg)
[![GitHub issues](https://img.shields.io/github/issues/mcstreetguy/cdb-driver.svg)](https://github.com/MCStreetguy/cdb-driver/issues)
![GitHub last commit](https://img.shields.io/github/last-commit/mcstreetguy/cdb-driver.svg)
[![Documentation Status](https://readthedocs.org/projects/cdbdriver/badge/?version=latest)](http://cdbdriver.readthedocs.io/en/latest/?badge=latest)

CouchDB seems the perfect database for JavaScript applications since it uses
JSON as data structure. On first sight, this makes it really easy to interact
with a CouchDB instance. But endless encapsulation of asynchroneous requests
and their callbacks gets annoying fast.

Thus this library provides both, asynchroneous and synchroneous methods.
Performing synchroneous requests on the main thread is deprecated and should not
be used in production environments, even if its provided by this library.

**For further information on how to use this library check out the documentation.**
