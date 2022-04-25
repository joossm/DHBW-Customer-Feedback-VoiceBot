import {SessionHandler} from "../../handler/sessionHandler.js";
import {DatabaseHandler} from "../../database/databaseHandler.js";
import {fallback} from "../999_fallbackIntent.js";

const databaseHandler = new DatabaseHandler();


export async function date(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state");

    if (!(state === "NAME")) {
        return fallback(agent);
    }
    // Geburtstag des Kunden
    if (state === "NAME") {
        let birthday = agent.parameters.date.toString().slice(0, 10);
        console.log("Geburtstag: " + birthday.toString());

        var name = sessionHandler.getSessionParameter("nameKunde");

        var selectQuery = `SELECT *
                           FROM kunde
                           WHERE Name = '${name}'
                             AND Geburtstag = '${birthday}';`;
        var result = await databaseHandler.query(selectQuery, (name, birthday))


        let sessionParameterBdayIntent = sessionHandler.getSessionParameter("bdayIntent");
        if (result.length > 0) {
            agent.add(`Bitte nenne mir nun deinen Service Pin`);
            sessionHandler.addSessionParameters({
                state: "GEBURTSTAG",
                birthday: birthday.toString(),
                servicePin: result[0].Servicepin.toString(),
                idKunde: result[0].idKunde.toString()
            });

            // TODO delete if not needed anymore
            console.log(result[0]);
            console.log(result[0].idKunde);
            console.log(result[0].Name);
            console.log(result[0].Geburtstag);
            console.log(result[0].Servicepin);
            console.log(result.length);
            await databaseHandler.close();
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

