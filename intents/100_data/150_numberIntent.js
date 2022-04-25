import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";
import {databaseHandler} from "../../database/databaseHandler.js";


export async function number(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!((state === "GEBURTSTAG") || (state === "AUFTRAGSNUMMER"))) {
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
            console.log(result);
            if (result.length === 0) {
                var selectQuery = `SELECT *
                                   FROM auftrag
                                   WHERE idKunde = '${idKunde}'
                                     AND rated = '1';`;
                var result = await databaseHandler.query(selectQuery, idKunde)
                if (result === 0) {
                    agent.add(`Es liegt kein Auftrag für Feedback vor.`);
                } else {
                    agent.add(`Zu allen Aufträgen wurde bereits Feedback abgegeben`);
                }
                agent.end(`Vielen Dank für Ihren Anruf.`);
                // ENDE TELEFONAT

            }
            if (result.length === 1) {
                agent.add(`Es liegt ${result.length} Auftrag für Feedback vor.`);
                agent.add(`Ich habe folgenden Auftrag für Feedback gefunden:`);
                agent.add(`Auftrag ${result[0].idAuftrag} vom ${result[0].datum}`);
                agent.add(`Wollen Sie diesen bewerten, dann wiederholen Sie bitte die Auftragsnummer.`);
                sessionHandler.addSessionParameters({
                    state: "AUFTRAGSNUMMER",
                });
            }

            if (result.length > 1) {
                agent.add(`Es liegen ${result.length} Aufträge für Feedback vor.`);
                for (var i = 0; i < result.length; i++) {
                    agent.add(`Auftrag ${result[i].idAuftrag} vom ${result[i].datum}`);
                }
                agent.add(`Sagen Sie bitte die Auftragsnummer des Auftrags, den Sie bewerten möchten.`);
                sessionHandler.addSessionParameters({
                    state: "AUFTRAGSNUMMER",
                });
            }

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
    if (state === "AUFTRAGSNUMMER") {
        let auftragsnummer = agent.parameters.number;
        console.log("Auftragsnummer: " + auftragsnummer);
        sessionHandler.addSessionParameters({
            state: "AUFTRAGSEVALUIERUNG",
            idAuftrag: auftragsnummer.toString(),
        });
        agent.add("Wie zufrieden sind Sie mit der Lieferzeit? Bitte bewerten Sie wie folgt, sagen Sie 1 für sehr gut, 2 für In Ordnung und 3 für zu lange.")
    }
    if (state === "AUFTRAGSEVALUIERUNG") {
        let bewertung = agent.parameters.number;
        console.log("Lieferzeit: " + bewertung);
        sessionHandler.addSessionParameters({
            state: "LIEFERZEIT",
            lieferzeit: bewertung.toString(),
        });
        agent.add("Wie zufrieden Sie sind Sie mit der Qualität? Bitte bewerten Sie wie folgt, sagen Sie 1 für sehr gut, 2 für gut, 3 für zufrieden, 4 für mangelhaft.")
    }
    if (state === "LIEFERZEIT") {
        let bewertung = agent.parameters.number;
        console.log("Qualität: " + bewertung);
        sessionHandler.addSessionParameters({
            state: "QUALITAET",
            qualitaet: bewertung.toString(),
        });
        agent.add("Würden Sie wieder bei uns bestellen und uns weiter empfehlen? Bitte bewerten Sie wie folgt, sagen Sie 1 für Ja oder 2 für Nein.")
    }
    if (state === "QUALITAET") {
        let bewertung = agent.parameters.number;
        console.log("Weiter Empfehlen: " + bewertung);
        sessionHandler.addSessionParameters({
            state: "EMPFEHLEN",
            empfehlen: bewertung.toString(),
        });
        agent.add("Würden Sie bei uns wieder bei uns bestellen und uns weiter empfehlen? Bitte bewerten Sie wie folgt, sagen Sie 1 für Ja oder 2 für Nein.")
    }


}