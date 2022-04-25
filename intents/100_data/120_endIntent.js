import {WebhookClient} from 'dialogflow-fulfillment';
import {SessionHandler} from "../../handler/sessionHandler.js";
import {fallback} from "../999_fallbackIntent.js";


/**
 * Default Welcome Intent
 *
 * @param {WebhookClient} agent
 */
export function end(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state", null);

    if (!(state === "AUFTRAGSNUMMER")) {
        return fallback(agent);
    }

    if (state === "AUFTRAGSNUMMER") {
        agent.end("Vielen Dank für Ihren Anruf. Wir wünschen Ihnen einen schönen Tag und bleiben Sie gesund.");
    }
}