import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";
import mysql from "mysql";

export function date(agent) {


    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!(state === "NAME")) {
        return fallback(agent);
    }
    // Geburtstag des Kunden
    if (state === "NAME") {
        let birthday = agent.parameters.date.toString().slice(0, 10);

        sessionHandler.addSessionParameters({
            state: "GEBURTSTAG", birthday: birthday.toString()
        });
        var name = sessionHandler.getSessionParameter("nameKunde")
        console.log("Name: " + name);
        console.log("Geburtstag: " + birthday.toString());
        var select = `SELECT *
                      FROM kunde
                      WHERE Name = '${name}'
                        AND Geburtstag = '${birthday}';`;

        // TODO
        let output;

        const setOutput = (rows) => {
            output = rows;
            console.log(output);
        }


        var con = mysql.createConnection({
            host: "localhost", user: "root", database: "dhbw", password: "password"
        });
        // DATABASE ABFRAGEN
        con.connect(function (err) {
            if (err) throw err;
            con.query(select.toString(), function (err, rows, fields) {
                if (err) throw err;
                setOutput(rows);
                sessionHandler.addSessionParameters({
                    result: rows
                });
            });
        });
        var result = con.query(select.toString(),);
        console.log(result);
        let sessionParameterBdayIntent = sessionHandler.getSessionParameter("bdayIntent");
        console.log("HILFE");
        console.log(sessionHandler.getSessionParameter("result"));
        if (!output) {
            console.log("HILFE");

            agent.add(`Bitte nenne mir nun deinen Service Pin`);
        } else {
            if (sessionParameterBdayIntent === "3") {
                agent.end("Ich habe dich leider zu oft nicht verstanden. Du wirst mit dem Kundenservice verbunden.!");
            } else {
                if (sessionParameterBdayIntent === "0") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "1", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                }
                if (sessionParameterBdayIntent === "1") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "2", state: "START"

                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                }
                if (sessionParameterBdayIntent === "2") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "3", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                }
            }

        }


    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
