'use strict';
import express from 'express';

import {welcome} from "./intents/000_welcomeIntent.js";
import {fallback} from "./intents/999_fallbackIntent.js";
import {WebhookClient} from "dialogflow-fulfillment";
import {fullName} from "./intents/100_data/110_fullNameIntent.js";
import {number} from "./intents/100_data/150_numberIntent.js";
import {date} from "./intents/100_data/160_dateIntent.js";
import {SessionHandler} from "./handler/sessionHandler.js";


const app = express();


app.post("/webhook", express.json(), (req, res) => {
    // --------------------------------------------------------------------------
    // CREATE WEBHOOKCLIENT (AGENT)
    // --------------------------------------------------------------------------
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    // --------------------------------------------------------------------------
    // SETUP DATABABASE
    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    // MAPPING INTENTS
    // --------------------------------------------------------------------------
    let intentMap = new Map();
    intentMap.set('000_welcomeIntent', welcome);
    intentMap.set('110_fullNameIntent', fullName);
    //intentMap.set('320_addressIntent', address);
    //intentMap.set('330_phoneNumberIntent', phoneNumber);
    //intentMap.set('340_eMailIntent', eMail);
    intentMap.set('150_numberIntent', number);
    intentMap.set('160_dateIntent', date);
    intentMap.set('999_fallbackIntent', fallback);


    return agent.handleRequest(intentMap);
})

app.listen(8080, () => console.log("Server is live at port 8080!"));

