import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";
import {DatabaseHandler} from "../../database/databaseHandler.js";

const databaseHandler = new DatabaseHandler();


export function number(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!(state === "GEBURTSTAG")) {
        return fallback(agent);
    }


    // INTENT Servicepin
    if (state === "GEBURTSTAG") {
        // Erfassung der Servicepin
        let servicePin = agent.parameters.number;
        let servicePinValidate = sessionHandler.getSessionParameter("servicePin", null);
        let servicePinValidateTrys = sessionHandler.getSessionParameter("servicePinIntent", null);


        if (servicePin.toString() === servicePinValidate.toString()) {
            agent.add(`Bitte nenne mir nun deinen Service Pin`);
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


        sessionHandler.addSessionParameters({
            state: "MOC_CN",
        });
        agent.add("Bitte teilen Sie uns ihre Telefonnummer oder E-Mail mit.");
        console.log("Kundennummer: " + servicePin.toString());
    }

}