import {WebhookClient} from 'dialogflow-fulfillment';
import {SessionHandler} from "../handler/sessionHandler.js";


/**
 * Default Welcome Intent
 *
 * @param {WebhookClient} agent
 */

export function welcome(agent) { //Export = Public
    agent.add("Hallo hier ist der Kundenservice!\n" +
        "Bitte nennen Sie uns Ihren Namen?");
    let sessionHandler = new SessionHandler(agent)
    sessionHandler.addSessionParameters({
        state: "START",
        intent: "0",
        bdayIntent: "0",
    })
}
