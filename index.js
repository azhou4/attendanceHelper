// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const AWS = require('aws-sdk');

const starterData = {
    students : {
        1: {
          name: "Amy",
          id: 1,
          parentEmail: "laurelrwoods@gmail.com",
          language: "zh-CN"
        },
        2: {
          name: "Elena",
          id: 2,
          parentEmail: "jjgg411@gmail.com",
          language: "es"
          },
        3: {
            name: "Gracie",
            id: 3,
            parentEmail: "jjgg411@gmail.com",
            language: "es"
        },
        4: {
          name: "Jenny",
          id: 4,
          parentEmail: "jjgg411@gmail.com",
          language: "en"
        },
        5: {
          name: "Laurel",
          id: 5,
          parentEmail: "laurelrwoods@gmail.com",
          language: "fr"
        },
        6: {
            name: "Oliver",
            id: 6,
            parentEmail: "amymzhou0@gmail.com",
            language: "en"
        }
    },
    absences : {
    }

}


async function setAbsent(handlerInput, studentId, date){
    const attributesManager = handlerInput.attributesManager;
    const s3Attributes = await attributesManager.getPersistentAttributes() || {};
    let a = s3Attributes.absences[date];
    if (!a){
        a = [studentId];
    }else if (!a.includes(studentId)){
        a.push(studentId);
    }
    s3Attributes.absences[date] = a;

    attributesManager.setPersistentAttributes(s3Attributes);
    await attributesManager.savePersistentAttributes();
}

const listOfStudents = {
    "Amy": {
        name: "Amy",
        contact: {
            email: 'jjgg411@gmail.com',
            language: 'zh-CN'
        },
        attendance: {
            '06-03-2019': true,
            '06-04-2019': false
        }
    },
    "Laurel": {
        name: "Laurel",
        contact: {
            email: 'jjgg411@gmail.com',
            language: 'es'
            
        },
        attendance: {
            '06-03-2019': false,
            '06-04-2019': false
        }
    },
    "Elena": {
        name: "Elena",
        contact: {
            email: 'jjgg411@gmail.com',
            language: 'fr'
        },
        attendance: {
            '06-03-2019': true,
            '06-04-2019': false
        }
    },
    "Jenny": {
        name: "Jenny",
        contact: {
            email: 'jjgg411@gmail.com',
            language: 'en'
        },
        attendance: {
            '06-03-2019': false,
            '06-04-2019': false
        }
    }
}

var nodemailer = require('nodemailer');
var lists;
async function emailsender(students1, absences){
        const fetch = require('node-fetch');
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'notification4attendance@gmail.com',
            pass: 'attendance123'
          }
        });
        // async function forEach() {
        var count = 1;
        lists = {};
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var date = mm + '/' + dd + '/' + yyyy;
        async function datastuff() {
        for (var studentId of absences[date]) {
            var s = students1[studentId];
                var name = s.name;
                console.log(name);
                var header = `Dear Parents of ${name}`;
                var body = `We would like to inform you that ${name} was absent from class today on ${date}.`;
                var body2 = 'If this is an excused absence, please email us back and let us know.';
                var end = 'Thank you,';
                
                var sourceLang = 'en';
                var targetLang = s.language;
                console.log(targetLang);
                
                lists['translatedHeader'+count]; 
                lists['translatedBody'+count];
                lists['translatedEnd'+count];
                lists['translatedBody2'+count]
                
                var url; 

                async function getHeader() {
                    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(header);
                    try {
                        await fetch(url)
                        .then(response => response.json())
                        .then(data => lists['translatedHeader'+count] = data[0][0][0])
                        .then(() => getBody());
                    } catch(e) {console.log(e)}
                }
                
                async function getBody() {
                    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(body);
                    try {
                        await fetch(url)
                        .then(response => response.json())
                        .then(data => lists['translatedBody'+count] = data[0][0][0])
                        .then(() => getBody2());
                    } catch(e) {console.log(e)}
                }
                
                async function getBody2() {
                    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(body2);
                    try {
                        await fetch(url)
                        .then(response => response.json())
                        .then(data => lists['translatedBody2'+count] = data[0][0][0])
                        .then(() => getEnd());
                    } catch(e) {console.log(e)}
                }
                
                async function getEnd() {
                    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(end);
                    try {
                        await fetch(url)
                        .then(response => response.json())
                        .then(data => lists['translatedEnd'+count] = data[0][0][0])
                        .then(() => lists['entire'+count] = `<h4>${lists['translatedHeader'+count]}</h4><h4>${lists['translatedBody'+count]} ${lists['translatedBody2'+count]}</h4><h4>${lists['translatedEnd'+count]}</h4><h4>Seattle Nativity School Attendance Office</h4>`);
                    } catch(e) {console.log(e)}
                }
                
                async function entire() {
                    var fetchData = await getHeader();
                    var mailOptions = {
                      from: 'notification4attendance@gmail.com',
                      to: s.parentEmail,
                      subject: 'Attendance Notification',
                      html: lists['entire'+count]
                    };
                
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });
                    console.log(lists['entire'+count])
                }
                
                await entire();
        }
    }
    datastuff();
}

const SendReportIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SendReportIntent';
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        console.log("attr mangr:", attributesManager);
        const s3Attributes = await attributesManager.getPersistentAttributes() || {};
        console.log("s3attr:", s3Attributes);
        emailsender(s3Attributes.students, s3Attributes.absences);
        var abs = s3Attributes.absences;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var date = mm + '/' + dd + '/' + yyyy;
        var speechText = 'Absence reports were sent to the parents of ';

            for (const studId of abs[date]){
                speechText = speechText + s3Attributes.students[studId].name + ", ";
            }
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt("")
            .getResponse();
    }
};
 
//  const s3handler = {
//      canHandle(handlerInput){
//          return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//             && handlerInput.requestEnvelope.request.intent.name === 's3intent';
//      },
 
//     async handle(handlerInput){

//         const attributesManager = handlerInput.attributesManager;
//         let s3Attributes = {"counter":10};
//         attributesManager.setPersistentAttributes(s3Attributes);
//         await attributesManager.savePersistentAttributes();
    
//         let speechOutput = `Hi there, Hello World! Your saved counter is ${s3Attributes.counter}`;
    
//         return handlerInput.responseBuilder
//             .speak(speechOutput)
//             .getResponse();
//     }
// }

const debugIntentHandler = {
     canHandle(handlerInput){
         return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'debugIntent';
     },

    async handle(handlerInput){

        const attributesManager = handlerInput.attributesManager;
        // const s3Attributes = await attributesManager.getPersistentAttributes() || {};

        let s3Attributes = starterData;

        // s3Attributes.absences["07/20/2019"] = [2, 3];
        attributesManager.setPersistentAttributes(s3Attributes);
        await attributesManager.savePersistentAttributes();

        // let speechOutput = `Your saved counter is ${s3Attributes.students[1].name}`;
       //let speechOutput = "hello";


       const speechOutput = "Attendance data has been reset.";

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt("")
            .getResponse();
    }
}

var students;
var iteration = 0;

var isTakingAttendance = false;


const HereIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HereIntent';
    },
    handle(handlerInput) {
        
        console.log(iteration);
        if(isTakingAttendance)
        {
            if(iteration <= Object.keys(students).length)
            {
                var speechText = students[iteration].name;
                iteration = iteration +1;
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
            else {
                isTakingAttendance = false;
                return handlerInput.responseBuilder
                    .speak("Attendance has been taken")
                    .reprompt("You can now get the report.")
                    .getResponse();
            }
            
        }
        
        
    }
}


const NotHereIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'NotHereIntent';
    },
    handle(handlerInput) {
        setAbsent(handlerInput, iteration-1, "07/19/2019");
        
        if(isTakingAttendance)
        {
            if(iteration <= Object.keys(students).length)
            {
                var speechText = students[iteration].name;
                iteration = iteration +1;
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
            else {
                isTakingAttendance = false;
                return handlerInput.responseBuilder
                    .speak("Attendance has been taken")
                    .reprompt("You can now get the report.")
                    .getResponse();
            }
        }
        
    }
}





 
 const TakeAttendanceIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'takeAttendanceIntent';
    },
    async handle(handlerInput) {
        
        const attributesManager = handlerInput.attributesManager;
        console.log("attr mangr:", attributesManager);
        const s3Attributes = await attributesManager.getPersistentAttributes() || {};
        console.log("s3attr:", s3Attributes);
        students = s3Attributes.students
        
        console.log("students:", students);
        
        iteration = 1;
        console.log(iteration);
        
        isTakingAttendance = true;
        
        
        
        if(iteration < Object.keys(students).length)
        {
            var speechText = students[iteration].name;
            iteration = iteration +1;
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
        else {
            isTakingAttendance = false;
            return handlerInput.responseBuilder
                .speak("Attendance has been taken")
                .reprompt("You can now get the report.")
                .getResponse();
        }
    }
};





// const Translate = require('@google-cloud/translate');

// // Instantiates a client
// const translate = Translate();

// // The text to translate
// const text = 'Ahoj světe!';

// // The source language
// const source = 'cs';

// // The target language
// const target = 'fr';

// const options = {
//   from: source,
//   to: target
// };

// function translationFunc(text, options)
// {
//     translate.translate(text, options).then((results) => {console.log(JSON.stringify(results, null, 2));})
//     .catch((err) => {console.error('ERROR:', err);});
// }








const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const speechText = 'Welcome to attendance helper. You can now take attendance, get your attendance report, and send out attendance emails.';
        //translationFunc(text, options);
        
        // const attributesManager = handlerInput.attributesManager;
        // let s3Attributes = {"number":11};
        // attributesManager.setPersistentAttributes(s3Attributes);
        // await attributesManager.savePersistentAttributes();
    
        // let speechOutput = `Hi there, Hello World! Your saved counter is ${s3Attributes.number}`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const GetReportIntentHandler = {
      canHandle(handlerInput) {
          return handlerInput.requestEnvelope.request.type === 'IntentRequest'
              && handlerInput.requestEnvelope.request.intent.name === 'getReportIntent';
      },

      async handle(handlerInput) {

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var date = mm + '/' + dd + '/' + yyyy;
        //var date = "07/18/2019";


        const attributesManager = handlerInput.attributesManager;
        const s3Attributes = await attributesManager.getPersistentAttributes() || {};

        const absentStudents = s3Attributes.absences[date];
        if (!absentStudents){
            speechText = "There is no attendance yet for today."
        }else {
            const numAbsentStudents = absentStudents.length;
            const numPresentStudents = Object.keys(s3Attributes.students).length - numAbsentStudents;

            var speechText = `There are ${numAbsentStudents} students absent, and ${numPresentStudents} students present. `;
            speechText += "The absent students are: ";

            for (const studId of absentStudents){
                speechText = speechText + s3Attributes.students[studId].name + ", ";
            }
        }

          return handlerInput.responseBuilder
              .speak(speechText)
              .reprompt("You can now send the report")
              .getResponse();
      }
  };


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        SendReportIntentHandler,
        LaunchRequestHandler,
        GetReportIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        TakeAttendanceIntentHandler,
        NotHereIntentHandler,
        HereIntentHandler,
        debugIntentHandler,
        ) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:'amzn1-ask-skill-5df9b6ef-e055-buildsnapshotbucket-1gib3mbts9qag'})
        //process.env.S3_PERSISTENCE_BUCKET
    )
    .lambda();
