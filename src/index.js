// Global Variables

var APP_NAME = 'Follow Bird';
var usernames = ['alexa2016', 'be9concepts', 'kanye west', 'google', 'john4pple'];
var spelled_usernames = ['alexa 2 0 1 6', 'b e 9 concepts', 'kanye west', 'google', 'john 4 p p l e'];
var cur_username = 0;


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.


var http = require('http');
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("MyColorIsIntent" === intentName) {
        setColorInSession(intent, session, callback);
    } else if ("WhatsMyColorIntent" === intentName) {
        getColorFromSession(intent, session, callback);
    } else if ("CheckColorIntent" === intentName) {
        getColorFromAction(intent, session, callback);
    }else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to " + APP_NAME +
        ". Please tell me your user name by saying something like, 'my user name is "+spelled_usernames[cur_username]+"'";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me your user name by saying something like, " +
        "my user name is "+spelled_usernames[cur_username];
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function getHelpResponse(callback) {
        couldSay();

    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Help";
    var speechOutput = "Ok, " +
        "to set your user name you can say, my user name is. " +
        "For example, if your user name were "+usernames[cur_username]+", you would say "+ spelled_usernames[cur_username] +
        ". Also, you can check your followers by saying, how many followers does "+spelled_usernames[cur_username]+" have?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me your user name by saying something like, " +
        "my user name is "+spelled_usernames[cur_username];
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function couldSay(){
    var rando = Math.floor((Math.random() * usernames.length-1) + 1);
    cur_username = rando;
}
function handleSessionEndRequest(callback) {
    var cardTitle = "Goodbye... tweet";
    var speechOutput = "Thanks for using " + APP_NAME + ", keep tweeting!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setColorInSession(intent, session, callback) {
    
    var cardTitle = intent.name;
    var favoriteColorSlot = intent.slots.Color;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (favoriteColorSlot) {
        var favoriteColor = favoriteColorSlot.value;
        var str = favoriteColor;
        str = str.replace('zero', '0');
        str = str.replace('one', '1');
        str = str.replace('two', '2');
        str = str.replace('three', '3');
        str = str.replace('four', '4');
        str = str.replace('five', '5');
        str = str.replace('six', '6');
        str = str.replace('seven', '7');
        str = str.replace('eight', '8');
        str = str.replace('nine', '9');
        // remove spaces to make it a username
        str = str.replace(/ /g,''); 
        // remove periods if they exist 
        str = str.replace(/\./g, '');
        sessionAttributes = createFavoriteColorAttributes(str);
        cardTitle = favoriteColor;
        speechOutput = "Ok, your username is " + favoriteColor + ". You can ask me " +
            "how many followers your have by saying, 'my followers'";
            repromptText = "You can ask me your user name by saying, what's my user name?";
    } else {
        cardTitle = "I didn't get that";
        speechOutput = "I'm not sure what your user name is. Please try again";
        repromptText = "I'm not sure what your user name is. You can tell me your " +
            "user name by saying, my user name is, and then spell out your username.";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createFavoriteColorAttributes(favoriteColor) {
    return {
        favoriteColor: favoriteColor
    };
}

function getColorFromSession(intent, session, callback) {
    
    var favoriteColor;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
        var cardTitle = intent.name;


    if (session.attributes) {
        favoriteColor = session.attributes.favoriteColor;
    }
    
    if (favoriteColor) {
        var str = session.attributes.favoriteColor;

        // replace spelled out numbers with numerics before convertince spaced out to numbers by accidednt
        str = str.replace('zero', '0');
        str = str.replace('one', '1');
        str = str.replace('two', '2');
        str = str.replace('three', '3');
        str = str.replace('four', '4');
        str = str.replace('five', '5');
        str = str.replace('six', '6');
        str = str.replace('seven', '7');
        str = str.replace('eight', '8');
        str = str.replace('nine', '9');
        // remove spaces to make it a username
        str = str.replace(/ /g,''); 
        // remove periods if they exist 
        str = str.replace(/\./g, '');
        SendSMS(str,session, callback);
    } else {
                cardTitle = "I didn't get that";

        speechOutput = "I'm not sure what your username is, you could say, my username " +
            " is alexa 2 0 1 6";

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
}
function getColorFromAction(intent, session, callback) {
    
    var favoriteColor;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var cardTitle ='';
    var speechOutput = "";

    if (intent.slots.Color != '') {
        favoriteColor = intent.slots.Color.value;
    }
    
    if (favoriteColor) {
        var str = favoriteColor;

        // replace spelled out numbers with numerics before convertince spaced out to numbers by accidednt
        str = str.replace('zero', '0');
        str = str.replace('one', '1');
        str = str.replace('two', '2');
        str = str.replace('three', '3');
        str = str.replace('four', '4');
        str = str.replace('five', '5');
        str = str.replace('six', '6');
        str = str.replace('seven', '7');
        str = str.replace('eight', '8');
        str = str.replace('nine', '9');
        // remove spaces to make it a username
        str = str.replace(/ /g,''); 
        // remove periods if they exist 
        str = str.replace(/\./g, '');
        
        SendSMS(str,session, callback);
    } else {
        cardTitle = "Didn't get that";
        speechOutput = "I'm not sure what your username is, you could say, my username " +
            " is "+ spelled_usernames[cur_username];

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
}
// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
function SendSMS(username,session, callback) {
    
    
    // Options and headers for the HTTP request   
    var options = {
        host: 'development.be9concepts.com',
        path: '/alexaskill/?username=' + username,
        method: 'GET',
        headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                 }
    };
    
    // Setup the HTTP request
    var req = http.request(options, function (res) {

        res.setEncoding('utf-8');
              
        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });
        
        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
            
            var parsedResponse = JSON.parse(responseString);
            
            var sessionAttributes = {};
            var cardTitle = parsedResponse.followers + " Followers";
            var speechOutput = parsedResponse.followers;
            
            var repromptText = parsedResponse.followers;
            var shouldEndSession = false;
            
        
            if (speechOutput != '-1'){


            callback(sessionAttributes,
                     buildSpeechletResponse(cardTitle, username+" currently has "+speechOutput+ " followers on Twitter", repromptText, shouldEndSession));
            }
            else {


            callback(sessionAttributes,
                     buildSpeechletResponse(cardTitle, "Sorry, "+username+" doesn't seem to exist on Twitter, try spelling out the name again. you can also say help at any time", repromptText, shouldEndSession));
            }
            
        });
    });
    
    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
        
        var sessionAttributes = {};
            var cardTitle = "Sent";
            var speechOutput = "Unfortunately, sms request has finished with errors.";
            
            var repromptText = "";
            var shouldEndSession = false;

            callback(sessionAttributes,
                     buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        
    });
    
    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    req.write('messageString');
    req.end();

}