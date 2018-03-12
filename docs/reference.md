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
  state: "number",    // The http status code of the response
  response: "object"  // The actual response body
}
```

### driver.info(...)
_[Endpoint: /](http://docs.couchdb.org/en/latest/api/server/common.html#get--)_

Accessing the root of a CouchDB instance returns meta information about the instance. The response is a JSON structure containing information about the server, including a welcome message and the version of the server.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `callback` | function | no | [_Callback_](#methods) |

!!! abstract "Developers Annotation"
    _This method is perfect for testing the connection to the database.    
    In addition this can also be used to split further requests from the main process by providing a callback function.
    Within that callback you can perform synchroneous requests as you want without impacting the users performance._

### driver.allDbs(...)
_[Endpoint: /_all_dbs](http://docs.couchdb.org/en/latest/api/server/common.html#get--_all_dbs)_

Returns a list of all the databases in the CouchDB instance.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `callback` | function | no | [_Callback_](#methods) |

### driver.getDb(...)
_[Endpoint: /{db}](http://docs.couchdb.org/en/2.1.1/api/database/common.html#get--db)_

Gets information about the specified database.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `dbIdentifier` | string | yes | The database id to get information from. |
| `callback` | function | no | [_Callback_](#methods) |

### driver.createDb(...)
_[Endpoint: /{db}](http://docs.couchdb.org/en/2.1.1/api/database/common.html#put--db)_

Creates a new database. The database name {db} must be composed by following next rules:

- Name must begin with a lowercase letter (`a-z`)
- Lowercase characters (`a-z`)
- Digits (`0-9`)
- Any of the characters: `_`, `$`, `(`, `)`, `+`, `-` and `/`

If you’re familiar with Regular Expressions, the rules above could be written as    
`^[a-z][a-z0-9_$()+/-]*$`.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `dbIdentifier` | string | yes | The database id to create. |
| `callback` | function | no | [_Callback_](#methods) |

### driver.getDocs(...)
_[Endpoint: /{db}/_all_docs](http://docs.couchdb.org/en/2.1.1/api/database/bulk-api.html#get--db-_all_docs)_

Returns a JSON structure of all of the documents in a given database. The information is returned as a JSON structure containing meta information about the return structure, including a list of all documents and basic contents, consisting the ID, revision and key. The key is the from the document’s `_id`.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `dbIdentifier` | string | yes | The database id to get the documents from. |
| `callback` | function | no | [_Callback_](#methods) |

### driver.storeDoc(...)
_[Endpoint: /{db}](http://docs.couchdb.org/en/2.1.1/api/database/common.html#post--db)_

Creates a new document in the specified database, using the supplied JSON document structure.
If the JSON structure includes the `_id` field, then the document will be created with the specified document ID.
If the `_id` field is not specified, a new unique ID will be generated, following whatever UUID algorithm is configured for that server.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `dbIdentifier` | string | yes | The database id to store the document in. |
| `data` | object | yes | The data to store as a document. |
| `callback` | function | no | [_Callback_](#methods) |

### driver.getDoc(...)
_[Endpoint: /{db}/{doc}](http://docs.couchdb.org/en/2.1.1/api/document/common.html#get--db-docid)_

Returns document by the specified `doc` from the specified `db`. Unless you request a specific revision, the latest revision of the document will always be returned.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `dbIdentifier` | string | yes | The database id to get the document from. |
| `docIdentifier` | string | yes | The document id to retrieve. |
| `callback` | function | no | [_Callback_](#methods) |

### driver.deleteDoc(...)
_[Endpoint: /{db}/{doc}](http://docs.couchdb.org/en/2.1.1/api/document/common.html#delete--db-docid)_

Marks the specified document as deleted by adding a field `_deleted` with the value `true`. Documents with this field will not be returned within requests anymore, but stay in the database.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `dbIdentifier` | string | yes | The database id to delete the document from. |
| `docIdentifier` | string | yes | The id of the document to delete. |
| `docRevision` | string | yes | The latest revision id of the document. |
| `callback` | function | no | [_Callback_](#methods) |

### driver.updateDoc(...)
_[Endpoint: /{db}/{doc}](http://docs.couchdb.org/en/2.1.1/api/document/common.html#put--db-docid)_

This method creates a new revision of the existing document.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `dbIdentifier` | string | yes | The database id to update the document from. |
| `docIdentifier` | string | yes | The id of the document to update. |
| `docRevision` | string | yes | The latest revision id of the document. |
| `data` | object | yes | The new data to store. |
| `callback` | function | no | [_Callback_](#methods) |

### driver.storeUser(...)
_[Endpoint: /_users/{user}](http://docs.couchdb.org/en/2.1.1/api/document/common.html#put--db-docid)_

Creates or updates a database user.

Instead of single options, this method only accepts a plain object for configuration.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `options` | object | yes | Configures the behaviour of this method. |
| `callback` | function | no | [_Callback_](#methods) |

`options` has to implement the following scheme:

``` javascript
{
  username: "string",   // The username of the account
  password: "string",   // The password of the account
  roles: "array",       // (optional) The account roles
  additionals: "object" // (optional) Additional field that shall be stored in the user document.
}
```

!!! abstract "Developers Annotation"
    There's a whole bunch of background information provided in the [official documentation of CouchDB](http://docs.couchdb.org/en/latest/intro/security.html).    
    Head up there for further reading on what is happening within this method and on the server-side.

### driver.storeAdmin(...)
_[Endpoint: /_node/_local/_config/admins/{user}](http://docs.couchdb.org/en/latest/intro/security.html#creating-new-admin-user)_    
_[Legacy Endpoint: /_config/admins/{user}](http://docs.couchdb.org/en/1.6.1/intro/security.html#creating-new-admin-user)_

Creates or updates an admin user.

| Argument | Type | Required | Description |
|---------:|:----:|:--------:|:------------|
| `username` | string | yes | The admins username. |
| `password` | string | yes | The admins password. |
| `callback` | function | no | [_Callback_](#methods) |
