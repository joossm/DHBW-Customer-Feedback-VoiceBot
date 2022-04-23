import {WebhookClient} from "dialogflow-fulfillment";
import {SessionHandler} from "../handler/sessionHandler.js";

/**
 * Default Fallback Intent
 *
 * @param {WebhookClient} agent
 */
export function fallback(agent) {
    let sessionHandler = new SessionHandler(agent);
    let state = sessionHandler.getSessionParameter("state");
    let sessionParameterIntent = sessionHandler.getSessionParameter("intent");
    if (sessionParameterIntent === "3") {
        agent.end("Ich habe dich leider zu oft nicht verstanden. Du wirst mit dem Kundenservice verbunden.!");
    } else {
        if (sessionParameterIntent === "0") {
            sessionHandler.addSessionParameters({
                intent: "1"
            });
            agent.add("Bitte wiederholen Sie das.");
        }
        if (sessionParameterIntent === "1") {
            sessionHandler.addSessionParameters({
                intent: "2"
            });
            agent.add("Bitte wiederholen Sie das.");
        }
        if (sessionParameterIntent === "2") {
            sessionHandler.addSessionParameters({
                intent: "3"
            });
            agent.add("Bitte wiederholen Sie das.");
        }
    }


}