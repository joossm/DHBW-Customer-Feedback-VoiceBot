import {WebhookClient} from 'dialogflow-fulfillment';
import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";


/**
 * Default Welcome Intent
 *
 * @param {WebhookClient} agent
 */
export function phoneNumber(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!((state === "MOC_CN")
        || (state === "SCC_CN")
        || (state === "MOC_CN_ADDRESS"))) {
        return fallback(agent);
    }


    // INTENTS Auszugsbestätigung
    if (state === "MOC_CN") {
        // Erfassung der Telefonnummer
        let phoneNumber = agent.parameters.phonenumber.toString();
        sessionHandler.addSessionParameters({
            state: "MOC_PE",
            emailorphone: phoneNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihre neue Adresse für die Schlußrechnung mit.");
        console.log("Telefonnummer: " + phoneNumber.toString());
    }


    // INTENTS Lieferantenwechselbestätigung
    if (state === "SCC_CN") {
        // Erfassung der Telefonnummer
        let phoneNumber = agent.parameters.phonenumber.toString();
        sessionHandler.addSessionParameters({
            state: "SCC_PE",
            emailorphone: phoneNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihre Marktlokation oder Zählernummer mit.  Bitte antworten Sie in einem vollständigen Satz.");
        console.log("Telefonnummer: " + phoneNumber.toString());
    }


    // INTENTS Auszug & Lieferantenwechsel
    if (state === "MO_SC_ADDRESS") {
        // Erfassung der Telefonnummer
        let phoneNumber = agent.parameters.phonenumber.toString();
        sessionHandler.addSessionParameters({
            state: "MO_SC_PE",
            emailorphone: phoneNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihre Marktlokation oder Zählernummer mit. Bitte antworten Sie in einem vollständigen Satz.");
        console.log("Telefonnummer: " + phoneNumber.toString());
    }

}
