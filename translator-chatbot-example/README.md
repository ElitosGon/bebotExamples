# Feedback Chatbot with Text Translator API (Microsoft)
to run the chatbot you need:
1. you need to add your Text Translator end point and api key.
```
# Bot Framework Credentials
MICROSOFT_APP_ID=
MICROSOFT_APP_PASSWORD=
TRANSLATOR_TEXT_API_ENDPOINT='{YOUR ENDPOINT}'
TRANSLATOR_TEXT_API_KEY='{YOUR API KEY}'
```

## The used method of bebot library is:
- Text Translator API:
    1. Import bebot-library module Microsoft: textTranslate.
    ```
    var bebotLibrary = require('bebot-library');
    var translatorTextAPI = bebotLibrary.microsoft.textTranslate;
    ```
    2. Create the BeBot library Object Interface to text translator API.
    ```
    var translatorTextObject = translatorTextAPI(process.env.TRANSLATOR_TEXT_API_KEY, process.env.TRANSLATOR_TEXT_API_ENDPOINT);

    ```
    3. Using the method detect.
    ```
        var ParametersHelper = translatorTextObject.detectParametersHelper('', session.message.text);
        translatorTextObject.detect(null, ParametersHelper, function (err, data) {
            if(data){
                // process data
            }
            if(err){
                // process error
            }
        });
    ```  