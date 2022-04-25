"use strict";
import {WebhookClient} from "dialogflow-fulfillment";
import {fallback} from "../intents/999_fallbackIntent.js";

export class SessionHandler {
    /**
     * constructor for SessionHandler
     *
     * @param   {WebhookClient}  webhookClient
     */
    constructor(webhookClient) {
        this.agent = webhookClient;
    }

    /**
     * Add parameters to current session, while keeping existing ones
     *
     * @param   {object}  params
     */
    addSessionParameters(params) {
        let parameters = this.agent.request_.body.queryResult.outputContexts[0].parameters;
        parameters = Object.assign(parameters, params);
        this.agent.context.set({
            name: 'session_state',
            lifespan: 25,
            parameters: parameters
        });
    }

    /**
     * Get a parameter value from session with fallback to a default value
     *
     * @param   {string}  parameter
     * @param   {*}       defaultValue
     * @returns {*}
     */
    getSessionParameter(parameter, defaultValue = null) {
        let sessionState = this.agent.request_.body.queryResult.outputContexts.find(e => e.name.includes("session_state"));
        // Check if sessionState is not null or undefined
        if (sessionState != null) {
            let sessionValue = sessionState.parameters[parameter];
            // Check if sessionValue is not null or undefined
            if (sessionValue != null) {
                return sessionValue;
            } else {
                return defaultValue;
            }
        }
        return fallback(this.agent);
    }
}