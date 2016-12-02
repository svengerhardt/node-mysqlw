# mysqlw

A lightweight wrapper for [node-mysql](https://github.com/mysqljs/mysql) to simplify queries.

## Installation

```
npm install mysqlw --save
```

## Configuration

```
let config = {
    "pooling": true,
    "connection": {
        "host": "HOSTNAME",
        "user": "USERNAME",
        "password": "PASSWORD",
        "database": "DATABASE"
    }
};
```

For more `connection` options see: [connection-options](https://github.com/mysqljs/mysql#connection-options)

## Example Usage

```js
let co = require("co");

let Database = require("mysqlw");
let db = new Database(config);

co (function *() {

    yield db.beginTransaction();
    yield db.query("INSERT INTO users SET ?", {"userName": "bob", ... });
    yield db.query("INSERT INTO users SET ?", {"userName": "tom", ... });
    yield db.endTransaction();
        
    let result = yield db.query("SELECT * FROM users");
    console.log(result);
        
}).catch ((error) => {
    // error;
});
```

To use plain ES6 `require("mysqlw/es6")`

## Promises

Parameters marked with (*) are optional:

* query(sql, *values)
* beginTransaction()
* endTransaction()
* rollback(*error);

**Example**

```js
db.query("INSERT INTO users SET ?", {"userName": "bob", ...}).then((result) => {
    // result
}, (error) => {
    // error
});
```

## Functions

* getConnection(callback)
* endConnection(connection)

**Example**

```js
let Database = require("mysqlw");
let db = new Database(config);

db.getConnection((error, connection) => {
    connection.query("... SQL QUERY ...", (error, rows) => {
        db.endConnection(connection);
        // do someting with rows
    });
});
```

endConnection(connection) - if `config.pooling: true` the connection will return to the pool.
