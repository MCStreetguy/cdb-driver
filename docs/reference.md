title: Reference
description: A brief overview about all available methods and options.
path: blob/master/app
source: module.js

## Constructor
``` javascript
var driver = new CDBDriver(options)
```

`options` has to be a plain object containing the following keys:

| Key | Type | Required | Description |
|:---:|:----:|:--------:|:------------|
| `host` | string | yes | The database host URL. |
| `user` | string | no | The username for authentication. |
| `pass` | string | no | The password for authentication. |

You can also pass in an URL string directly. CDBDriver then takes care of parsing that into a configuration object.

!!! tip
    When using a configuration string, make sure it follows the [URL standards](https://url.spec.whatwg.org/#example-url-parsing). Otherwise you might run into errors.

## Methods
All methods are capable of synchroneous and asychroneous invokation. If you specify the `callback` parameter
on any method as a function, the request will be made asynchroneous.    

The following object scheme applies to the return values of synchroneous calls, as well as for callback arguments of asynchroneous calls:

``` javascript
{
  state: "number", // The http status code of the response
  response: "object" // The actual response body
}
```

### driver.info(...)
_[Endpoint: /](http://docs.couchdb.org/en/2.1.1/api/server/common.html#get--)_

> Accessing the root of a CouchDB instance returns meta information about the instance. The response is a JSON structure containing information about the server, including a welcome message and the version of the server.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `callback` | function | no | [_Callback_](#methods) |

??? abstract "Developers Annotation"
    _This method is perfect for testing the connection to the database.    
    In addition this can also be used to split further requests from the main process by providing a callback function.
    Within that callback you can perform synchroneous requests as you want without impacting the users performance._
