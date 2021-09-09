/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require("axios");
const data = require('./data.js');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const travel = require('./travel.js');
const level = require("./level.js");
const vaccine = require("./vaccine.js");



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = travel["welcome"];
        const repromptText = data["repromptText"];

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

//getTravelInfo
const getTravelInfoIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "getTravelInfoIntent"
    );
  },
  handle(handlerInput) {
    const from = handlerInput.requestEnvelope.request.intent.slots.from.value.toLowerCase();
    const to = handlerInput.requestEnvelope.request.intent.slots.to.value.toLowerCase();
    var speakOutput = "Sorry I could not understand, Please try again";
    var i;
    var from_flag = 0;
    var to_flag = 0;
    if (from_flag === 0 && to_flag === 0) {
      for (i = 0; i < travel["national_e"].length; i++) {
        if (travel["national_e"][i] === to) {
          to_flag += 1;
        }
        if (travel["national_e"][i] === from) {
          from_flag += 1;
        }
      }
      if (to_flag && from_flag) {
        speakOutput = `You cannot travel from ${from} to ${to} unless you have a reasonable excuse due to national lockdown in England`;
      } else {
        speakOutput = `You cannot travel as the country borders are closed due to lockdown `;
      }
    }

    if (from_flag === 0 && to_flag === 0) {
      for (i = 0; i < travel["national_e"].length; i++) {
        if (travel["national_i"][i] === to) {
          to_flag += 1;
        }
        if (travel["national_i"][i] === from) {
          from_flag += 1;
        }
      }
      if (to_flag && from_flag) {
        speakOutput = `You cannot travel from ${from} to ${to} unless you have a reasonable excuse due to national lockdown in Northern Ireland`;
      } else {
        speakOutput = `You cannot travel as the country borders are closed due to lockdown `;
      }
    }

    if (from_flag === 0 && to_flag === 0) {
      for (i = 0; i < travel["national_e"].length; i++) {
        if (travel["national_w"][i] === to) {
          to_flag += 1;
        }
        if (travel["national_w"][i] === from) {
          from_flag += 1;
        }
      }
      if (to_flag && from_flag) {
        speakOutput = `You cannot travel from ${from} to ${to} unless you have a reasonable excuse due to national lockdown in Wales`;
      } else {
        speakOutput = `You cannot travel as the country borders are closed due to lockdown `;
      }
    }

    if (from_flag === 0 && to_flag === 0) {
      for (i = 0; i < travel["level3"].length; i++) {
        if (travel["level3"][i] === from) {
          let distance = travel["level3"][travel["level3"].length - 1];
          if (from === "glasgow") {
            let travel_distance = travel[from][to];
            if (distance - travel_distance >= 0) {
              speakOutput = `You can travel from ${from} to ${to}, the distance is ${travel_distance} miles, dont forget to take precautions`;
            } else {
              speakOutput = `No, the limit to travel in level3 restriction is ${distance} miles and the distance from ${from} to ${to} is ${travel_distance} miles.`;
            }
          } else {
            speakOutput = `The travel distance restriction is ${distance} miles, travel only if you have a reasonable excuse`;
          }
        }
      }
      for (i = 0; i < travel["level2"].length; i++) {
        if (travel["level2"][i] === from) {
          let distance = travel["level2"][travel["level2"].length - 1];
          speakOutput = `The travel distance restriction in level2 is ${distance} miles, travel only if you have a reasonable excuse`;
        }
      }
      for (i = 0; i < travel["level1"].length; i++) {
        if (travel["level1"][i] === from) {
          let distance = travel["level1"][travel["level1"].length - 1];
          speakOutput = `The travel distance restriction in level1 is ${distance} miles, travel only if you have a reasonable excuse`;
        }
      }
    }
    // speakOutput = `${from}${to}`
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt("Please try again")
      .getResponse();
  },
};


// getLockDownInfoIntentHandler
const getLockDownInfoIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "getLockDownInfoIntent"
    );
  },
  handle(handlerInput) {
    const query =
      handlerInput.requestEnvelope.request.intent.slots.level.value.toLowerCase();
    var speakOutput = "Sorry I could not understand, Please try again";
    if (level["level1"]["code"] === query) {
      speakOutput = `Level 1 restrictions apply for ${level["level1"]["1"]},
        ${level["level1"]["2"]},
        ${level["level1"]["3"]},
        ${level["level1"]["4"]}, read all restrictions on www.gov.scot
      `;
    }
    if (level["level2"]["code"] === query) {
      speakOutput = `Level 2 restrictions apply for ${level["level2"]["1"]},
          ${level["level2"]["2"]},
          ${level["level2"]["3"]},
          ${level["level2"]["4"]},
          ${level["level2"]["5"]}, read all restrictions on www.gov.scot
        `;
    }
    if (level["level3"]["code"] === query) {
      speakOutput = `Level 3 restrictions apply for ${level["level1"]["1"]},
          ${level["level3"]["2"]},
          ${level["level3"]["3"]},
          ${level["level3"]["4"]},
          ${level["level3"]["5"]},
          ${level["level3"]["6"]}, read all restrictions on www.gov.scot
        `;
    }
    if (level["tier1"]["code"] === query) {
      speakOutput = `Tier 1 restrictions apply for ${level["tier1"]["1"]},
          ${level["tier1"]["2"]},
          ${level["tier1"]["3"]}, read all restrictions on www.gov.uk
        `;
    }
    if (level["tier2"]["code"] === query) {
      speakOutput = `Tier 2 restrictions apply for ${level["tier2"]["1"]},
          ${level["tier2"]["2"]},
          ${level["tier2"]["3"]},
          ${level["tier2"]["4"]}, read all restrictions on www.gov.uk
        `;
    }
    if (level["tier3"]["code"] === query) {
      speakOutput = `Tier 3 restrictions apply for ${level["tier3"]["1"]},
          ${level["tier3"]["2"]},
          ${level["tier3"]["3"]}, read all restrictions on www.gov.uk
        `;
    }
    if (level["tier4"]["code"] === query) {
      speakOutput = `Tier 4 restrictions apply for ${level["tier4"]["1"]},
          ${level["tier4"]["2"]},
          ${level["tier4"]["3"]},
          ${level["tier4"]["4"]},
          ${level["tier4"]["5"]}, read all restrictions on www.gov.uk
        `;
    }
    if (level["national"]["code"] === query) {
      speakOutput = `National restrictions apply for ${level["national"]["1"]},
          ${level["national"]["2"]},
          ${level["national"]["3"]},
          ${level["national"]["4"]}
        `;
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt("Please try again")
      .getResponse();
  },
};


//getCityRestrictionInfoIntent
const getCityRestrictionInfoIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "getCityRestrictionInfoIntent"
    );
  },
  handle(handlerInput) {
    const city =
      handlerInput.requestEnvelope.request.intent.slots.city.value.toLowerCase();
    var speakOutput = "Sorry I could not understand, Please try again";
    var i;
    for (i = 0; i < travel["national_e"].length; i++) {
      if (travel["national_e"][i] === city) {
        speakOutput =
          "National lockdown restrictions are placed in all parts of England";
      }
    }
    for (i = 0; i < travel["national_i"].length; i++) {
      if (travel["national_i"][i] === city) {
        speakOutput =
          "National lockdown restrictions are placed in all parts of Northern Ireland";
      }
    }
    for (i = 0; i < travel["national_w"].length; i++) {
      if (travel["national_w"][i] === city) {
        speakOutput =
          "National lockdown restrictions are placed in all parts of Wales";
      }
    }
    for (i = 0; i < travel["level1"].length; i++) {
      if (travel["level1"][i] === city) {
        speakOutput = `The city ${city} has level1 lockdown restrictions in place`;
      }
    }
    for (i = 0; i < travel["level2"].length; i++) {
      if (travel["level2"][i] === city) {
        speakOutput = `The city ${city} has level2 lockdown restrictions in place`;
      }
    }
    for (i = 0; i < travel["level3"].length; i++) {
      if (travel["level3"][i] === city) {
        speakOutput = `The city ${city} has level3 lockdown restrictions in place`;
      }
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt("Please try again")
      .getResponse();
  },
};


//precautionsIntent
const precautionsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'precautionsIntent';
    },
    handle(handlerInput) {
        
        const speakOutput = data.Precaution;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Would you like to know anything more')
            .getResponse();
    }
};


//dietIntent
const dietIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'dietIntent';
    },
    handle(handlerInput) {
        
        const speakOutput = data.Diet;
        const info = 'For more info please visit www.emro.who.int/nutrition'

        return handlerInput.responseBuilder
            .speak(speakOutput+' '+info)
            .reprompt('Would you like to know anything more')
            .getResponse();
    }
};


// getCountryCasesIntent
const getCountryCasesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'getCountryCasesIntent';
    },
    async handle(handlerInput) {

        let value = handlerInput.requestEnvelope.request.intent.slots.country.value.toLowerCase();
        // let today = new Date();
        // let yesterday = new Date();
        // yesterday.setDate(today.getDate() - 1);
        
        // let queryDate = yesterday.toISOString().slice(0, 10);
        
        const response = await axios.get(`https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=${value}&structure={"date":"date","name":"areaName","code":"areaCode","newCasesByPublishDate":"newCasesByPublishDate"}`);
        const date = response.data.data[0]["date"];
        const cases = response.data.data[0]["newCasesByPublishDate"];
        const place = response.data.data[0]["name"];
        const speakOutput = `covid cases as on ${date} in ${place} are ${cases}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Would you like to know anything more')
            .getResponse();
    }
};


// getOverviewCaseIntent
const getOverviewCaseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'getOverviewCaseIntent';
    },
    async handle(handlerInput) {

        const response = await axios.get(`https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=overview&structure={"date":"date","name":"areaName","code":"areaCode","newCasesByPublishDate":"newCasesByPublishDate"}`);
        const date = response.data.data[0]["date"];
        const cases = response.data.data[0]["newCasesByPublishDate"];
        const place = response.data.data[0]["name"];
        const speakOutput = `covid cases as on ${date} in ${place} are ${cases}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Would you like to know anything more')
            .getResponse();
    }
};




// getOverviewVaccineIntent
const getOverviewVaccineIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'getOverviewVaccineIntent';
    },
    async handle(handlerInput) {

        const response = await axios.get(`https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=overview&structure={"date":"date","name":"areaName","code":"areaCode","newCasesByPublishDate":"newCasesByPublishDate"}`);
        const date = response.data.data[0]["date"];
        const cases = response.data.data[0]["newCasesByPublishDate"];
        const place = response.data.data[0]["name"];
        const speakOutput = `covid cases as on ${date} in ${place} are ${cases}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Would you like to know anything more')
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        precautionsIntentHandler,
        dietIntentHandler,
        getCountryCasesIntentHandler,
        getOverviewCaseIntentHandler,
        getOverviewVaccineIntentHandler,
        getTravelInfoIntentHandler,
        getLockDownInfoIntentHandler,
        getCityRestrictionInfoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();