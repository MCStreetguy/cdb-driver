title: Further Information
description: Further information on this library and it's practices.

## Compatibility
Since major version updates always come along with breaking changes, CDBDriver tries
to recognize the database version initially to take care of endpoint inconsistencies.
To achieve this, the **Legacy Mode** was introduced.

When enabled, some API endpoints get changed to ensure full functionality.
This is checked automatically within the constructor by invoking the `info()` method on the current instance.

!!! abstract "Developers Annotation"
    Even if it's technically possible, I don't recommend connecting to databases on lower versions than v2.
    There is no guarantee that the legacy mode works as expected. Consider [upgrading to a newer version](http://docs.couchdb.org/en/latest/install/upgrading.html) of CouchDB.
