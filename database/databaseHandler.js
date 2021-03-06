"use strict";

import mysql from "mysql";


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "dhbw",
    serverTimezone: "UTC",
});

export class DatabaseHandler {
    constructor() {
        this.connect();
    }

    connect() {
        con.connect(err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Connected to database');
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            con.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        con.end();
        console.log('Connection to database ended');
    }

}

export const databaseHandler = new DatabaseHandler();
