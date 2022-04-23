/*
Zählernummer
Zählerstand
Marktlokation oder Zählernummer
Zählerstände*/

import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";

export function number(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!((state === "MOC_NAME")
        || (state === "MOC_NT")
        || (state === "MOC_MN")
        || (state === "SCC_NAME")
        || (state === "SCC_PE")
        || (state === "SCC_MN")
        || (state === "MO_SC_PE")
        || (state === "MO_SC_MN"))) {
        return fallback(agent);
    }


    // INTENTS Auszugsbestätigung
    if (state === "MOC_NAME") {
        // Erfassung der Kundennummer
        let customerNumber = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "MOC_CN",
            customerNumber: customerNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihre Telefonnummer oder E-Mail mit.");
        console.log("Kundennummer: " + customerNumber.toString());
    }
    if (state === "MOC_NT") {
        // Erfassung der Marktlokation oder der Zählernummer
        let meterNumber = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "MOC_MN",
            meterNumber: meterNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihren Zählerstand mit. Bitte in einem Vollständigen Satz.");
        console.log("Zählernummer: " + meterNumber.toString());
    }
    if (state === "MOC_MN") {
        // Erfassung des Zählerstands
        let meterReading = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "MOC_MR",
            meterReading: meterReading.toString()
        });
        agent.add("Bitte teilen Sie uns das Ablesedatum mit. Bitte antworten Sie in einem vollständigen Satz.");
        console.log("Zählerstand: " + meterReading.toString());
    }


    // INTENTS Lieferantenwechselbestätigung
    if (state === "SCC_NAME") {
        // Erfassung der Kundennummer
        let customerNumber = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "SCC_CN",
            customerNumber: customerNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihre Telefonnummer oder E-Mail mit.");
        console.log("Kundennummer: " + customerNumber.toString());
    }
    if (state === "SCC_PE") {
        // Erfassung der Marktlokation oder der Zählernummer
        let meterNumber = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "SCC_MN",
            meterNumber: meterNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihren Zählerstand mit. Bitte in einem Vollständigen Satz.");
        console.log("Zählernummer: " + meterNumber.toString());
    }
    if (state === "SCC_MN") {
        // Erfassung des Zählerstands
        let meterReading = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "SCC_MR",
            meterReading: meterReading.toString()
        });
        agent.add("Bitte teilen Sie uns das Ablesedatum mit. Bitte antworten Sie in einem vollständigen Satz.");
        console.log("Zählerstand: " + meterReading.toString());
    }


    // INTENTS Auszug & Lieferantenwechsel
    if (state === "MO_SC_PE") {
        // Erfassung der Marktlokation oder der Zählernummer
        let meterNumber = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "MO_SC_MN",
            meterNumber: meterNumber.toString()
        });
        agent.add("Bitte teilen Sie uns ihren Zählerstand mit. Bitte in einem Vollständigen Satz.");
        console.log("Zählernummer: " + meterNumber.toString());
    }
    if (state === "MO_SC_MN") {
        // Erfassung des Zählerstands
        let meterReading = agent.parameters.number;
        sessionHandler.addSessionParameters({
            state: "MO_SC_MR",
            meterReading: meterReading.toString()
        });
        agent.add("Bitte teilen Sie uns die Adresse des Gebäudes in dem der Zähler eingebaut ist mit. Bitte antworten Sie in einem vollständigen Satz.");
        console.log("Zählerstand: " + meterReading.toString());
    }

}