"use strict";

let mysql = require("mysql");

class MySQLWrapper {

    constructor(config) {
        this.config = config || {};
        this._transactionConnection = null;
        this._pool = null;
    }

    getConnection(callback) {

        if (this._transactionConnection) {
            return callback(null, this._transactionConnection);
        }

        let options = this.config.connection;
        if (this.config.pooling) {
            if (this._pool == null) {
                this._pool = mysql.createPool(options);
            }
            this._pool.getConnection(callback);
        } else {
            let connection = mysql.createConnection(options);
            connection.connect( (error) => {
                callback(error, connection);
            })
        }
    }

    endConnection(connection) {
        if (this.config.pooling) {
            if (this._pool && connection) {
                connection.release();
                this._transactionConnection = null;
            }
        } else {
            if (connection) {
                this._transactionConnection = null;
                connection.end((error) => {
                    // do nothing
                });
            }
        }
    }

    close(callback) {
        if (this._pool != null) {
            this._pool.end(callback);
        } else {
            if (typeof callback === "function") {
                callback();
            }
        }
    }

    query(sql, values) {
        return new Promise((resolve, reject) => {
            this.getConnection((error, connection) => {
                if (error) {
                    return reject(error);
                }
                connection.query(sql, values, (error, result) => {
                    if (!this._transactionConnection) {
                        this.endConnection(connection);
                    }
                    if (error) {
                        if (this._transactionConnection) {
                            return this._transactionConnection.rollback(() => {
                                this.endConnection(this._transactionConnection);
                                reject(error);
                            });
                        } else {
                            return reject(error);
                        }
                    }
                    resolve(result);
                });
            });
        });
    }

    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.getConnection((error, connection) => {
                this._transactionConnection = connection;
                if (error) {
                    reject(error);
                } else {
                    this._transactionConnection.beginTransaction((error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    endTransaction() {
        return new Promise((resolve, reject) => {
            if (this._transactionConnection) {
                this._transactionConnection.commit((error) => {
                    if (error) {
                        return this.rollback(error);
                    } else {
                        this.endConnection(this._transactionConnection);
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    rollback(error) {
        return new Promise((resolve, reject) => {
            if (this._transactionConnection) {
                this._transactionConnection.rollback(() => {
                    this.endConnection(this._transactionConnection);
                    if (error) {
                        reject(error);
                    } else {
                        reject();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = MySQLWrapper;