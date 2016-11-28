let mysql = require("mysql");

class Database {

    constructor(config) {
        this.config = config || {};
        this.pool = null;
    }

    query(sql, values) {
        return new Promise((resolve, reject) => {
            this.getConnection((error, connection) => {
                if (error) {
                    return reject(error);
                }
                connection.query(sql, values, (error, rows) => {
                    this.endConnection(connection);
                    if (error) {
                        return reject(error);
                    }
                    resolve(rows);
                });
            });
        });
    }

    getConnection(callback) {
        let options = this.config.connection;
        if (this.config.pooling) {
            if (this.pool == null) {
                this.pool = mysql.createPool(options);
            }
            this.pool.getConnection(callback);
        } else {
            let connection = mysql.createConnection(options);
            connection.connect( (error) => {
                callback(error, connection);
            })
        }
    }

    endConnection(connection) {
        if (this.config.pooling) {
            if (this.pool && connection) {
                connection.release();
            }
        } else {
            if (connection) {
                connection.end();
            }
        }
    }
}

module.exports.Database = Database;