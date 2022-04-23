import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";

export function eMail(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!((state === "MOC_CN")
        || (state === "SCC_CN")
        || (state === "MO_SC_ADDRESS"))) {
        return fallback(agent);
    }


    // INTENTS Auszugsbestätigung
    if (state === "MOC_CN") {
        // Erfassung der EMail Adresse
        let email = agent.parameters.email;
        sessionHandler.addSessionParameters({
            state: "MOC_PE",
            emailorphone: email.toString()
        });
        agent.add("Bitte teilen Sie uns ihre neue Adresse für die Schlußrechnung mit. ");
        console.log("E-Mail: " + email.toString());
    }


    // INTENTS Lieferantenwechselbestätigung
    if (state === "SCC_CN") {
        // Erfassung der EMail Adresse
        let email = agent.parameters.email;
        sessionHandler.addSessionParameters({
            state: "SCC_PE",
            emailorphone: email.toString()
        });
        agent.add("Bitte teilen Sie uns ihre Marktlokation oder Zählernummer mit. Bitte in einem vollständigen Satz.  Bitte antworten Sie in einem vollständigen Satz.");
        console.log("E-Mail: " + email.toString());
    }


    // INTENTS Auszug & Lieferantenwechsel
    if (state === "MO_SC_ADDRESS") {
        let email = agent.parameters.email;
        sessionHandler.addSessionParameters({
            state: "MO_SC_PE",
            emailorphone: email.toString()
        });
        agent.add("Bitte teilen Sie uns ihre Marktlokation oder Zählernummer mit. Bitte in einem vollständigen Satz.  Bitte antworten Sie in einem vollständigen Satz.");
        console.log("E-Mail: " + email.toString());
    }
}