# mysqlw

Wrapper for [node-mysql](https://github.com/mysqljs/mysql) to simplify queries.

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

For more connection options see: [node-mysql connection-options](https://github.com/mysqljs/mysql#connection-options)

## Usage

**Performing queries**

```js
let co = require("co");

let Database = require("mysqlw").Database;
let db = new Database(config);

co (function *() {

    let result = null;

    result = yield db.query("DELETE FROM core_users");
    result = yield db.query("INSERT INTO core_users SET ?", {"userName": "bob", "givenName": "Bob", "familyName": "Schmidt"});
    result = yield db.query("UPDATE core_users SET ? WHERE id=" + result.insertId, {"userName": "bobby"});
    result = yield db.query("SELECT * FROM core_users");
                
    console.log(result);
        
}).catch ((error) => {
    console.error(error);
});
```

**Establishing a connection**

```js
let Database = require("mysqlw").Database;
let db = new Database(config);

db.getConnection((error, connection) => {
    connection.query("... SQL QUERY ...", (error, rows) => {
        db.endConnection(connection);
        // do someting with rows
    });
});
```

## Functions

#### query(sql, values)

Performing queries.

**Example**

```js
db.query("INSERT INTO core_users SET ?", {"userName": "bob"}).then((result) => {
    console.log(result.insertId);
}, (error) => {
    console.error(error);
});
```

---

#### getConnection(callback)

Establishing a connection.

**Example**

```js
db.getConnection((error, connection) => {
    // do something with connection
});    
```

---

#### endConnection(connection)

Terminating a connection. If `config.pooling: true` the connection will return to the pool.

**Example**

```js
db.endConnection(connection);  
```

---
