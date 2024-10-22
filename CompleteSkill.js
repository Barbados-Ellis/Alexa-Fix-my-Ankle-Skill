/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const SKILL_NAME = "Fix My Ankle";
const helper = require('./helper');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello! Welcome to Fix My Ankle. You can get started by choosing your abilty level with the phrase i am beginner, intermediate or advanced level. Or you can enter "help" to learn about our service and the exercises we offer.';
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(SKILL_NAME, speakOutput)   //added to generate video output.
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Fix My Ankle lets you select exercises for your ankle sprain rehabilitation journey. We provide you with varying exercise volumes based on your ability level: beginner, intermediate or advanced.If you dont know what equipment is needed for your exercise, ask "what do i need for - your exercise". To get started, choose your level by saying I am, "your level".';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(SKILL_NAME, speakOutput)   //added to generate video output.
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
            .withSimpleCard(SKILL_NAME, speakOutput)   //added to generate video output.
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
            .withSimpleCard(SKILL_NAME, speakOutput)   //added to generate video output.
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

const GetLevelIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskLevelIntent';
    },
    handle(handlerInput) {
        
        //var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var exerciseLevel = handlerInput.requestEnvelope.request.intent.slots.exerciseLevel.value;
        var resolvedLevel;
        
        //sessionAttributes.exerciseLevel = exerciseLevel;
        
        exerciseLevel = helper.getSpokenWords(handlerInput, "exerciseLevel");
        resolvedLevel = helper.getResolvedWords(handlerInput, "exerciseLevel");
       
        var speakOutput = "";
        
        if (resolvedLevel) {
        
        var selectedLevel = resolvedLevel[0].value.name;
        
        speakOutput = `You are ${selectedLevel} level. `;
        if (selectedLevel === "advanced") {
         speakOutput += `These are the most physically challenging routines, usually done in the end stages of rehabilitation. You are on your way to a full recovery! `;
         }
        if (selectedLevel === "beginner") {
         speakOutput += ` These are the least physically challenging routines, usually done at the start of your rehabilitation journey. `;
         }
        if (selectedLevel === "intermediate") {
         speakOutput += `These routines are moderately challenging. You are making progress! `;
         }
         speakOutput += "Now, choose your exercise. You can choose from a list of: Jump Rope, Step Up, Resisted Range of Motion and Standing Calf Stretch";
         
         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
         
         sessionAttributes.selectedLevel = selectedLevel;
         
         handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }

         else {
             speakOutput = `I heard you say ${exerciseLevel}. I don't offer that level. Choose from beginner, intermediate or advanced.`;
         }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(SKILL_NAME, speakOutput)
            .getResponse();
    }
};

const GetExerciseIntentHandler = {
    
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetExerciseIntent';
    },
    async handle(handlerInput) {
        
    
        var speakOutput = ""
        
        var exercise = handlerInput.requestEnvelope.request.intent.slots.exercise.value;
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const selectedLevel = sessionAttributes.selectedLevel;
        
          //dynamodb
        
        var AWS = require("aws-sdk");

        var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
        
        var results = "";
       
    
        var params = {
            TableName : 'routineList',
            ExpressionAttributeNames:{
                "#pkey": "exercise"
            },
            ExpressionAttributeValues: {
                ":ex": exercise
            },
            KeyConditionExpression: "#pkey = :ex",
            
        };
        
        return  docClient.query(params, function(err,data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                console.log("data = " +  JSON.stringify(data,null,2));
                data.Items.forEach(function(item) {
                    console.log(" -", item.id + ": " + item.occurrences);
                    if(selectedLevel === "advanced"){
                    results += "The recommended volume of " +  item.exercise + " is: "  +item.reps + " reps for  " + 3*item.sets + " sets, daily.\n";
                }
                else if(selectedLevel === "intermediate"){
                    results += "The recommended volume of " +  item.exercise + " is: "  +item.reps + " reps for  " + 2*item.sets + " sets, daily.\n";
                }
                else if (selectedLevel === "beginner"){
                   results += "The recommended volume of " +  item.exercise + " is: "  +item.reps + " reps for  " + item.sets + " sets, daily.\n";
                }
                });
            }
            
            if (results)
                speakOutput = results + " You can stop here, choose another exercise or if you want to know what equipment is needed for this exercise, ask what do i need for "+ exercise+"?";
            else
                speakOutput = "Sorry, no result for " + exercise + " was found in the database.";
           
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .withSimpleCard(SKILL_NAME, speakOutput)   //added to generate video output.
            .getResponse();
            
        })
        .catch((error) => {
       console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
            
        });
    }
};

const GetEquipmentIntentHandler = {
    canHandle(handlerInput) {
         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetEquipmentIntent';
    },
    handle(handlerInput) {
        
        var exercise;
        var resolvedExercise;
        var exerciseSlot;
    
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        exerciseSlot = Alexa.getSlot(handlerInput.requestEnvelope, "exercise");
        exercise = exerciseSlot.value;
        
        //var exerciseLevel = sessionAttributes.exerciseLevel;
        
        if (sessionAttributes.selectedLevel === null) {
                return handlerInput.responseBuilder
                .speak("What level exercise would you like?")
                .reprompt(speakOutput)
                .getResponse();
            }

        exercise = helper.getSpokenWords(handlerInput, "exercise");
        resolvedExercise = helper.getResolvedWords(handlerInput, "exercise");

        var speakOutput = "";

        if (resolvedExercise) {
        
        var selectedExercise = resolvedExercise[0].value.name;
        
        speakOutput = `The equipment needed for ${selectedExercise} is as follows: `;
        if (selectedExercise === "jump rope") {
         speakOutput += `a good skipping rope, some comfortable shoes and some open space. `;
         }
        if (selectedExercise === "resisted range of motion") {
         speakOutput += ` an elastic resistance band and a surface to elevate the ankle. `;
         }
        if (selectedExercise === "standing calf stretch") {
         speakOutput += `an empty wall. `;
         }
        if (selectedExercise === "step up") {
         speakOutput += `stairs or an object stacked 6 to 7 inches high. `;
         }
         speakOutput += "Do you need a demonstration? Say 'Play demo video' and the number 1 for jump rope, 2 for step up, 3 for resisted range of motion or 4 for standing calf stretch. You can also say 'Stop' if you are finished. ";
         
         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
         
         sessionAttributes.selectedExercise = selectedExercise;
         
         handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }

         else {
             speakOutput = `I heard you say ${exercise}. I don't offer that exercise. Choose from jump rope, standing calf stretch, resisted range of motion or step up.`;
         }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(SKILL_NAME, speakOutput)   //added to generate video output.
            .getResponse();
    }
};



const PlayVideoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayVideoIntent';
    },
    handle(handlerInput) {
       var videoNumber = handlerInput.requestEnvelope.request.intent.slots.videoNumber.value;

       handlerInput.responseBuilder.addVideoAppLaunchDirective("https://exercise-demo-videos-proj.s3.amazonaws.com/demoVideo" + videoNumber + ".mp4");
       return handlerInput.responseBuilder.speak("Loading Demo Video " +videoNumber)
       .getResponse();
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
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        GetLevelIntentHandler,
        GetEquipmentIntentHandler,
        GetExerciseIntentHandler,
        PlayVideoIntentHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();