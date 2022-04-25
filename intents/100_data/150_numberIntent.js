import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";
import {databaseHandler} from "../../database/databaseHandler.js";


export async function number(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!(state === "GEBURTSTAG")) {
        return fallback(agent);
    }


    // INTENT Servicepin
    if (state === "GEBURTSTAG") {
        // Erfassung der Servicepin
        let servicePin = agent.parameters.number;
        console.log("Servicepin: " + servicePin);
        let servicePinValidate = sessionHandler.getSessionParameter("servicePin", null);
        console.log("ServicepinValidate: " + servicePinValidate);
        let servicePinValidateTrys = sessionHandler.getSessionParameter("servicePinIntent", null);
        console.log("ServicepinValidateTrys: " + servicePinValidateTrys);


        if (servicePin.toString() === servicePinValidate.toString()) {
            agent.add(`Einen Moment bitte. Ich schaue nach offenen Aufträgen.`);

            let idKunde = sessionHandler.getSessionParameter("idKunde", null);
            console.log("idKunde: " + idKunde);
            var selectQuery = `SELECT *
                               FROM auftrag
                               WHERE idKunde = '${idKunde}'
                                 AND rated = '0';`;
            var result = await databaseHandler.query(selectQuery, idKunde)
            if (result.length === 0) {
                agent.add(`Es liegt kein Auftrag für Feedback vor.`);

            }
            if (result.length === 1) {


            }

            if (result.length > 1) {
                agent.add(`Es liegen ${result.length} Aufträge für Feedback vor.`);

            }


            sessionHandler.addSessionParameters({
                state: "SERVICEPIN",
            });

        } else {
            if (servicePinValidateTrys === "3") {
                agent.end("Die Service Pin war zu oft falsch. Du wirst mit dem Kundenservice verbunden!");
            } else {
                if (servicePinValidateTrys === "0") {
                    sessionHandler.addSessionParameters({
                        servicePinIntent: "1", state: "GEBURTSTAG"
                    });
                    agent.add(`Die Service Pin ist falsch bitte versuchen Sie es erneut.`);
                }
                if (servicePinValidateTrys === "1") {
                    sessionHandler.addSessionParameters({
                        servicePinIntent: "2", state: "GEBURTSTAG"
                    });
                    agent.add(`Die Service Pin ist falsch bitte versuchen Sie es erneut.`);
                }
                if (servicePinValidateTrys === "2") {
                    sessionHandler.addSessionParameters({
                        servicePinIntent: "3", state: "GEBURTSTAG"
                    });
                    agent.add(`Die Service Pin ist falsch bitte versuchen Sie es erneut.`);
                }
            }
        }
    }

}