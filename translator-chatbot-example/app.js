require('dotenv').load();
var builder = require('botbuilder');
var restify = require('restify');
var parseString = require('xml2js').parseString;

// Import bebot-library module Microsoft: textTranslate
var bebotLibrary = require('bebot-library');
var translatorTextAPI = bebotLibrary.microsoft.textTranslate;

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);

});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// BeBot library Object Interface to text translator API
var translatorTextObject = translatorTextAPI(process.env.TRANSLATOR_TEXT_API_KEY, process.env.TRANSLATOR_TEXT_API_ENDPOINT);

// Memory manage
var inMemoryStorage = new builder.MemoryBotStorage();
// Create your bot with a function to receive messages from the user.
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.

/* This bot works with english = 'en' */
var bot = new builder.UniversalBot(connector, [
    function (session) {
        var ParametersHelper = translatorTextObject.detectParametersHelper('', session.message.text);
        translatorTextObject.detect(null, ParametersHelper, function (err, data) {
            if(data){
                parseString(data, function (err, result) {
                    session.userData.language = result.string._;
                    /* process the message in english*/
                    var customMessage = new builder.Message(session)
                        .text("You write in: " + session.userData.language)
                        .textFormat("plain")
                        .textLocale(session.userData.language);
                    session.send(customMessage);
                });
            }
            if(err){

            }
        });

        ParametersHelper = translatorTextObject.translationParametersHelper('', session.message.text, 'es', 'en', 'text/plain', 'general');
        translatorTextObject.translation(null, ParametersHelper, function (err, data) {
            if(data){
                parseString(data, function (err, result) {
                    session.message.text = result.string._;
                    /* process the message in english*/
                    var customMessage = new builder.Message(session)
                        .text("you write: " + session.message.text)
                        .textFormat("plain")
                        .textLocale(session.userData.language);
                    session.send(customMessage);

                });
            }
            if(err){
                console.log(err);
            }
        });

    }
]).set('storage', inMemoryStorage); // Register in-memory storage


