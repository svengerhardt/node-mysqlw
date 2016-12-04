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
    yield db.query("INSERT INTO users SET ?", {"userName": "bob"});
    yield db.query("INSERT INTO users SET ?", {"userName": "tom"});
    yield db.endTransaction();
        
    let result = yield db.query("SELECT * FROM users");
    console.log(result);
        
}).catch ((error) => {
    // error;
});
```

## Promises

Parameters marked with (*) are optional:

* query(sql, *values)
* beginTransaction()
* endTransaction()
* rollback(*error);

**Example**

```js
db.query("UPDATE users SET ? WHERE id=?", [{"userName":"Bobby"}, 1]).then((result) => {
    // result
}, (error) => {
    // error
});
```
