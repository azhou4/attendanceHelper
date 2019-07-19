const Alexa = require('ask-sdk-core');

const TakeAttendanceIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'takeAttendance';
    },
    handle(handlerInput) {
        //const speechText = 'Hello World!';
        //return handlerInput.responseBuilder
            //.speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            //.getResponse();

        var studentdata = new StudentDataGateway();

        var students = studentdata.getStudentList();
        for (student in students)
        {
            return  handlerInput.responseBuilder
                .speak(student.name)
                .reprompt(student.name)
                .getResponse();
                //.reprompt(student.name)
                //.getResponse();
        }
    }
};