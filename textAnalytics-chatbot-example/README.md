# Feedback Chatbot with Text Analytics API (Microsoft)
to run the chatbot you need:
1. you need to add your Text Analytics end point and api key.
```
# Bot Framework Credentials
MICROSOFT_APP_ID=
MICROSOFT_APP_PASSWORD=
TEXT_ANALITYCS_API_ENDPOINT='{YOUR ENDPOINT}'
TEXT_ANALITYCS_API_KEY='{YOUR API KEY}' 
```

## The used method of bebot library is:
- Text Analytics API:
    1. Import bebot-library module Microsoft: textAnalytics.
    ```
    var bebotLibrary = require('bebot-library');
    var textAnalitycsAPI = bebotLibrary.microsoft.textAnalytics;
    ```
    2. Create the BeBot library Object Interface to text Analytics API.
    ```
    var textAnalitycsObject = textAnalitycsAPI(process.env.TEXT_ANALITYCS_API_KEY, process.env.TEXT_ANALITYCS_API_ENDPOINT);
    
    ```
    3. Using the method sentimet.
    ```
        var BodyHelper = textAnalitycsObject.sentimentBodyHelper();
        BodyHelper.add_document('1', results.response, 'en');
        textAnalitycsObject.sentiment(BodyHelper.body, null, function (err, data) {
            if (data) {
                // Process data
            }
            if (err) {
                // Process error
            }
        });
    ```  