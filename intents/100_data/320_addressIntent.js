import {WebhookClient} from 'dialogflow-fulfillment';
import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";


/**
 * Default Welcome Intent
 *
 * @param {WebhookClient} agent
 */
export function address(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!((state === "MOC_PE")
        || (state === "MO_NAME")
        || (state === "SC_NAME")
        || (state === "MO_SC_MR"))) {
        return fallback(agent);
    }


    // INTENTS Auszugsbestätigung
    if (state === "MOC_PE") {
        // Erfassung der Adresse für die Schlußrechnung
        let address = agent.parameters.address;
        sessionHandler.addSessionParameters({
            state: "MOC_FB",
            addressForFinalBill: address.toString()
        });
        console.log("Adresse Schlußrechnung: " + address.toString());

        agent.add("Bitte teilen Sie uns sofern bekannt den Vornamen und Nachnamen des Nachmieters oder Eigentümers mit.");
    }


    // INTENTS Auszug & Lieferantenwechsel
    if ((state === "MO_NAME") || (state === "SC_NAME")) {
        // Erfassung der Adresse
        let address = agent.parameters.address.toString();
        sessionHandler.addSessionParameters({
            state: "MO_SC_ADDRESS",
            address: address.toString()
        });
        agent.add("Bitte teilen Sie uns ihre Telefonnummer oder E-Mail mit. Bitte in antworten Sie in einem vollständigen Satz.");
        // TODO: Add address
        console.log("Adresse: " + address.toString());
    }
    if (state === "MO_SC_MR") {
        // Erfassung der Zähleradresse
        let address = agent.parameters.address;
        sessionHandler.addSessionParameters({
            state: "MO_SC_MA",
            meterReadingAddress: address.toString()
        });
        console.log("Adresse Zähler: " + address.toString());
        // TODO: Überprüfen ob alle Angaben korrekt sind
        agent.add("Bitte überprüfen Sie die Daten. ");
        agent.add("Anrufgrund: " + sessionHandler.getSessionParameter("callTopic"));
        agent.add("Name: " + sessionHandler.getSessionParameter("firstname")
            + " " + sessionHandler.getSessionParameter("lastname"));
        agent.add("Adresse: " + sessionHandler.getSessionParameter("address"));
        agent.add("E-Mail oder Telefonnummer: " + sessionHandler.getSessionParameter("emailorphone"));
        agent.add("Zählernummer oder Marktlokation: " + sessionHandler.getSessionParameter("meterNumber"));
        agent.add("Zählerstand: " + sessionHandler.getSessionParameter("meterReading"));
        agent.add("Zähleradresse: " + sessionHandler.getSessionParameter("meterReadingAddress"));
        agent.add("Sind alle Angaben korrekt?");

    }

}