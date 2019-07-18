const Alexa = require('ask-sdk-core');

const listOfStudents = {
    "Elena": {
        name: "Elena",
        "contact": {
            "email": "jjgg411@gmail.com",
            "phone": "7573104372"
        },
        attendance: {
            "06/03/2019": true,
            "06/04/2019": false
        }        
    },
    "Amy": {
        name: "Amy",
        "contact": {
            "email": "jjgg411@gmail.com",
            "phone": "7573104372"
        },
        attendance: {
            "06/03/2019": true,
            "06/04/2019": true
        } 
    },
    "Laurel": {
        name: "Laurel",
        "contact": {
            "email": "jjgg411@gmail.com",
            "phone": "7573104372"
        },
        attendance: {
            "06/03/2019": false,
            "06/04/2019": false
        } 
    },    
    "Jenny": {
        name: "Jenny",
        "contact": {
            "email": "jjgg411@gmail.com",
            "phone": "7573104372"
        },
        attendance: {
            "06/03/2019": false,
            "06/04/2019": true
        } 
    }
} 

const SendReportIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SendReportIntent';
    },
    handle(handlerInput) {
        var today = new Date();
        var dd = String(today.getDate().padStart(2, '0'));
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var date_string = mm + '/' + dd + '/' + yyyy;
        const speechText = '';
        for (var student in listOfStudents) {
            if (!student.attendance[date_string]) {
                speechText = speechTex + student.name;
            }
        }
        // code to send report
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
