import {SessionHandler} from "../../handler/sessionHandler.js";
import {DataHandler} from "../../database/databaseHandler.js";
import {fallback} from "../999_fallbackIntent.js";

export async function date(agent) {
    let sessionHandler = new SessionHandler(agent);
    let dbHandler = new DataHandler();
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
        var name = sessionHandler.getSessionParameter("nameKunde");
        console.log("Geburtstag: " + birthday.toString());
        var select = `SELECT *
                      FROM kunde
                      WHERE Name = '${name}'
                        AND Geburtstag = '${birthday}';`;

        dbHandler.connect();
        var result = await dbHandler.query(select, (name, birthday))
        //console.log(result);
        //console.log(result.length);

        let sessionParameterBdayIntent = sessionHandler.getSessionParameter("bdayIntent");
        if (result.length > 0) {
            agent.add(`Bitte nenne mir nun deinen Service Pin`);
            await dbHandler.close()
        } else {
            if (sessionParameterBdayIntent === "3") {
                agent.end("Ich habe dich leider zu oft nicht verstanden. Du wirst mit dem Kundenservice verbunden.!");
                await dbHandler.close()
            } else {
                if (sessionParameterBdayIntent === "0") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "1", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                    await dbHandler.close()
                }
                if (sessionParameterBdayIntent === "1") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "2", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                    await dbHandler.close()
                }
                if (sessionParameterBdayIntent === "2") {
                    sessionHandler.addSessionParameters({
                        bdayIntent: "3", state: "START"
                    });
                    agent.add(`Es ist kein Kunde mit den genannten Informationen registriert. Bitte wiederholen Sie ihren Namen.`);
                    await dbHandler.close()
                }
            }
        }
    }
}

