import {SessionHandler} from "../../handler/sessionHandler.js";
import {databaseHandler} from "../../database/databaseHandler.js";
import {fallback} from "../999_fallbackIntent.js";


export async function date(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state");

    if (!(state === "NAME")) {
        return fallback(agent);
    }
    // Geburtstag des Kunden
    if (state === "NAME") {
        var name = sessionHandler.getSessionParameter("nameKunde");
        let loginTrys = sessionHandler.getSessionParameter("bdayIntent");
        let birthday = agent.parameters.date.toString().slice(0, 10);
        console.log("Geburtstag: " + birthday.toString());
        console.log("Login Trys: " + loginTrys);

        var selectQuery = `SELECT *
                           FROM kunde
                           WHERE Name = '${name}'
                             AND Geburtstag = '${birthday}';`;
        var result = await databaseHandler.query(selectQuery, (name, birthday))


        if (result.length > 0) {
            agent.add(`Bitte nenne mir nun deinen Service Pin`);
            sessionHandler.addSessionParameters({
                state: "GEBURTSTAG",
                birthday: birthday.toString(),
                servicePin: result[0].Servicepin.toString(),
                idKunde: result[0].idKunde.toString()
            });
        } else {
            if (loginTrys === "3") {
                agent.end("Ich habe dich leider zu oft nicht verstanden. Du wirst mit dem Kundenservice verbunden.!");
            } else {
                if (loginTrys === "0") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "1", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                }
                if (loginTrys === "1") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "2", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                }
                if (loginTrys === "2") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "3", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                }
            }
        }
    }
}

