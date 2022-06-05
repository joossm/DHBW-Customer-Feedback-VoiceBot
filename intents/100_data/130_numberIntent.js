import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";
import {databaseHandler} from "../../database/databaseHandler.js";


export async function number(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!((state === "GEBURTSTAG") || (state === "AUFTRAGSNUMMER") || (state === "AUFTRAGSEVALUIERUNG")
        || (state === "LIEFERZEIT") || (state === "QUALITAET") || (state === "AUFTRAGSEVALUIERUNG"))) {
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
        agent.add(`Einen Moment bitte. Ich schaue nach offenen Aufträgen.`);


        if (servicePin.toString() === servicePinValidate.toString()) {

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
                var result2 = await databaseHandler.query(selectQuery, idKunde)
                if (result2 === 0) {
                    agent.add(`Es liegt kein Auftrag für Feedback vor.`);
                    console.log("Es liegt kein Auftrag für Feedback vor.");
                } else {
                    agent.add(`Zu allen Aufträgen wurde bereits Feedback abgegeben`);
                }
                agent.add(`Vielen Dank für Ihren Anruf.`);
                // ENDE TELEFONAT

            }
            if (result.length === 1) {
                agent.add(`Es liegt ${result.length} Auftrag für Feedback vor.`);
                agent.add(`Ich habe folgenden Auftrag für Feedback gefunden:`);
                agent.add(`Auftrag ${result[0].idAuftrag} vom ${result[0].datum}`);
                agent.add(`Wollen Sie diesen bewerten, dann wiederholen Sie bitte die Auftragsnummer. Wenn Sie keinen Auftrag bewerten möchten, dann sagen sie bitte Ende.`);
                sessionHandler.addSessionParameters({
                    state: "AUFTRAGSNUMMER",
                });
            }

            if (result.length > 1) {
                agent.add(`Es liegen ${result.length} Aufträge für Feedback vor.`);
                for (var i = 0; i < result.length; i++) {
                    agent.add(`Auftrag ${result[i].idAuftrag} vom ${result[i].datum}`);
                }
                agent.add(`Sagen Sie bitte die Auftragsnummer des Auftrags, den Sie bewerten möchten. Wenn Sie keinen Auftrag bewerten möchten, dann sagen sie bitte Ende.`);
                sessionHandler.addSessionParameters({
                    state: "AUFTRAGSNUMMER",
                });
            }

        } else {
            if (servicePinValidateTrys === "3") {
                agent.add("Die Service Pin war zu oft falsch. Du wirst mit dem Kundenservice verbunden!");
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
        let idKunde = sessionHandler.getSessionParameter("idKunde", null);
        var selectProofQuery = `SELECT *
                                FROM auftrag
                                WHERE idKunde = '${idKunde}'
                                  AND rated = '0'
                                  AND idAuftrag = '${auftragsnummer}';`;
        var resultAN = await databaseHandler.query(selectProofQuery, (idKunde, auftragsnummer));
        console.log(resultAN);
        if (resultAN.length === 1) {
            sessionHandler.addSessionParameters({
                state: "AUFTRAGSEVALUIERUNG",
                idAuftrag: auftragsnummer.toString(),
            });
            agent.add("Wie zufrieden sind Sie mit der Lieferzeit? Bitte bewerten Sie wie folgt, sagen Sie Lieferzeit 1 für sehr gut, Lieferzeit 2 für In Ordnung und Lieferzeit 3 für zu lange.")
        } else {
            agent.add("Entschuldigung es ist ein Fehler passiert. Bitte wiederholen Sie die Auftragsnummer.")
        }
    }

    if (state === "AUFTRAGSEVALUIERUNG") {
        let bewertung = agent.parameters.number;
        console.log("Lieferzeit: " + bewertung);
        sessionHandler.addSessionParameters({
            state: "LIEFERZEIT",
            lieferzeit: bewertung.toString(),
        });
        agent.add("Wie zufrieden Sie sind Sie mit der Qualität? Bitte bewerten Sie wie folgt, sagen Sie Qualität 1 für sehr gut, Qualität 2 für gut, Qualität 3 für zufrieden, Qualität 4 für mangelhaft.")
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

        //submit values into the database
        let idAuftrag = sessionHandler.getSessionParameter("idAuftrag");
        let lieferzeit = sessionHandler.getSessionParameter("lieferzeit");
        let qualitaet = sessionHandler.getSessionParameter("qualitaet");
        let empfehlen = sessionHandler.getSessionParameter("empfehlen");

        var updateQuery = `UPDATE auftrag
                           SET lieferzeit = '${lieferzeit}',
                               qualiteat  = '${qualitaet}',
                               empfehlen  = '${empfehlen}',
                               rated      = '1'
                           WHERE idAuftrag = '${idAuftrag}';`;
        await databaseHandler.query(updateQuery);

        // Nach anderen offenen Aufträgen suchen
        let idKunde = sessionHandler.getSessionParameter("idKunde", null);
        console.log("idKunde: " + idKunde);
        var selectQuery = `SELECT *
                           FROM auftrag
                           WHERE idKunde = '${idKunde}'
                             AND rated = '0';`;
        var result = await databaseHandler.query(selectQuery, idKunde)
        console.log(result);
        if (result.length === 0) {
            agent.add("Vielen Dank für Ihr Feedback zu dem Auftrag mit der Nummer " + sessionHandler.getSessionParameter("idAuftrag") + ".")
            agent.add(`Es wurde zu allen Aufträgen Feedback gegeben. Vielen Dank und Auf Wiedersehen.`);
            // ENDE TELEFONAT
        }
        if (result.length === 1) {
            agent.add("Vielen Dank für Ihr Feedback zu dem Auftrag mit der Nummer " + sessionHandler.getSessionParameter("idAuftrag") + ".")
            agent.add(`Es liegt noch ${result.length} Auftrag für Feedback vor.`);
            agent.add(`Auftrag ${result[0].idAuftrag} vom ${result[0].datum}`);
            agent.add(`Wollen Sie diesen bewerten, dann wiederholen Sie bitte die Auftragsnummer. Wenn Sie keinen Auftrag bewerten möchten, dann sagen sie bitte Ende.`);
            sessionHandler.addSessionParameters({
                state: "AUFTRAGSNUMMER",
            });
        }

        if (result.length > 1) {
            agent.add("Vielen Dank für Ihr Feedback zu dem Auftrag mit der Nummer " + sessionHandler.getSessionParameter("idAuftrag") + ".")
            agent.add(`Es liegen noch ${result.length} Aufträge für Feedback vor.`);
            for (var i = 0; i < result.length; i++) {
                agent.add(`Auftrag ${result[i].idAuftrag} vom ${result[i].datum}`);
            }
            agent.add(`Sagen Sie bitte die Auftragsnummer des Auftrags, den Sie bewerten möchten. Wenn Sie keinen Auftrag bewerten möchten, dann sagen sie bitte Ende.`);
            sessionHandler.addSessionParameters({
                state: "AUFTRAGSNUMMER",
            });
        }

    }

}