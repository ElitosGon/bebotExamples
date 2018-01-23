require('dotenv').load();
var builder = require('botbuilder');
var restify = require('restify');
// Import bebot-library module Microsoft: textAnalytics
var bebotLibrary = require('bebot-library');
var textAnalitycsAPI = bebotLibrary.microsoft.textAnalytics;

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

// BeBot library Object Interface to text Analytics API
var textAnalitycsObject = textAnalitycsAPI(process.env.TEXT_ANALITYCS_API_KEY, process.env.TEXT_ANALITYCS_API_ENDPOINT);

// Memory manage
var inMemoryStorage = new builder.MemoryBotStorage();
// Create your bot with a function to receive messages from the user.
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.response; // Save user profile.
        session.beginDialog('feedback', session.userData.profile);
    }
]).set('storage', inMemoryStorage); // Register in-memory storage

bot.dialog('ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {}; // Set the profile or create the object.
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What's your name?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results) {
        if (results.response) {
            // Save user's name if we asked for it.
            session.dialogData.profile.name = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

bot.dialog('feedback', [
    function (session, args) {
        session.dialogData.profile = args || {};
        if (process.env.TEXT_ANALITYCS_API_KEY) {
            builder.Prompts.text(session, 'What is your feedback?');
        } else {
            session.send('Sorry, feedback session is under maintenance. Please try again later.');
            session.endDialog();
        }
    },
    function (session, results, next) {
        var BodyHelper = textAnalitycsObject.sentimentBodyHelper();
        BodyHelper.add_document('1', results.response, 'en');
        textAnalitycsObject.sentiment(BodyHelper.body, null, function (err, data) {
            if (data) {
                var score = data.documents.pop().score
                session.send(session.dialogData.profile.name + ", Thank your for the feedback! Your score is %s", score);
                var score = parseFloat(score);
                if (!isNaN(score)) {
                    if (score > 0.9) {
                        session.send('I am happy to know you are very satisfied =)');
                    }
                    else if (score > 0.5) {
                        session.send('I am happy to know you are satisfied and I will work to improve your satisfaction =)');
                    }
                    else {
                        session.send('I am sorry about your bad experience =(');
                        session.send('We are interested in knowing your opinion, please call us at +569 XXXX XXXX.');
                    }
                }
                next();
            }
            if (err) {
                session.send('Sorry, feedback session is under maintenance. Please try again later.');
                session.endDialog();
            }
        });
    }
]);