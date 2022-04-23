import {WebhookClient} from 'dialogflow-fulfillment';
import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";


/**
 * Default Welcome Intent
 *
 * @param {WebhookClient} agent
 */
export function fullName(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);
    if (!(state === "START")) {
        return fallback(agent);
    }

    // INTENT: fullName
    if (state === "START") {
        // Erfassung Name des Nachmieters
        /*let firstname = agent.parameters.firstname;
        let lastname = agent.parameters.lastname;
        let fullname = firstname + " " + lastname;*/
        let fullname = agent.parameters.person;
        sessionHandler.addSessionParameters({
            state: "NAME",
            nameKunde: fullname.name.toString()
        })
        console.log("Name: " + fullname.name.toString());

        agent.add("Bitte teilen Sie uns Ihr Geburtsdatum mit. Bitte antworten Sie in ganzen Sätzen.")
    }


}