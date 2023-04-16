// MEDI CHATBOT - APPOINTMENT BOOKING SETUP
'use strict';

// Import the Dialogflow module from Google client libraries.
const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

// Enter your calendar ID below and service account JSON below
const calendarId = "ed638895637c96df440ae6b268cd0b2632383d740a5abe3c9436e974388bfc3c@group.calendar.google.com";
const serviceAccount = {
  "type": "service_account",
  "project_id": "medi-apointment-booking",
  "private_key_id": "668b177f647ec6ebd9124d809ad74ad374941d2c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8Ext5SzXaHarT\nNzAGfFRacp2xRcEnrt1ibPpTjIFT1tbgpYwZpI2x0nTBWqmpZINB7Iq8yWoLAwQS\nVQFwMULPAWLwj7Jw4qc9xrdH2haTrsaemNyfAHh5jFZpYCHPKkOmVwul2GPrm0V4\nbnqsKyP0TG9EXQoxsH6D2QCt++jPxs0BnDFHMxm541iOL93WKX1obYQhI/HqHI6j\nnoRLLsqJM4FpWsB6j2/B3hFJlYKaz8jGud57PMnxt78mK0BKomirjD91vlh4J65g\njcwv8xnk5eYPaSltMKeFvETTJLd+i6Ylv/tkK7eAr/OJOQOEB7RULK7iCnSUtKpU\nqGd4M4EvAgMBAAECggEAKPJuBlvyFxFjekXnLlpOUTzoCUr7EUU4jO/WFm+eTp8V\nPGa+mGyjruX3poszKh6olydFU3H0pP4cmlMok4EeHwyZum9Gtd4a9E+54qpgRPoF\n40y7p+CF2kzMGXglFEIK5YHJFuwEYSz2lJBVI/vmgY9MoFEzYXsgKFuMEtUoLGgn\nZaGFAff2fgOSYuLMNdhijBlGlef6QGc660LJQAiy9n4JDd4MMsVw7X5Bm1UKPoWq\n1Pd/mXGWtoXO0qN8dBBtWfSMq+1LkN948pV738IIqfthgpcgdOEoqWtxhXMCDwnk\n5kEzSstwgsyfRkYgwMKRZTuwSEKMY3tNzSCD2DfVFQKBgQD05d3A7FUec+5VrxNh\nUbu28a/ZioyeDxo8XLFqGFb6jx+ssas617OWhGyyxvoOOIxbo5cbb42NeJVkd6Eq\nPLYZi0UEx8RiNazuONvc6UPULYLGZ5Yxjgb1WzEfQIs3yM8+uggfch9LqDxQdRYQ\nq5pOR1HB9zmSaiLMyuK94sWEVQKBgQDEmckH6sAeUEyc60W7gfyuoz1BP+6Vc8Os\nJZP32kQijwdg7I7JTmVnRqlarZVxXAxW1VpaUkpWtfcCkksy+bIwUD83TEs6iJOj\ni89+htGRsuanYB4yVZo3UYmq6qyrWiB7w47/DGH2IFLNcxy7Onj32zome942H6GD\nrcZ4ZsvTcwKBgE4RqSuDK29VzbiK40a243xid4iF3mXUsqxjcDs+Hxwo3BQVX1yW\nvq1Q8cXcIILADB56fAVG/n0G37jzWfE5AWQLPalUdYpJSiN3BL/brL/K8lGFXB/Y\nAufcdkBcNwVFgqugak579vYLX47WhH4z9jDWE34d7cB7DTTzyGx4CjcxAoGABNIc\nitQnx9aCOmrOd+2VC5c3Hk16BTIkfykgurggaZSGQssqKSeB9wlVh8Kv4mq2Zr6u\ni35vEjc+ClMaAvL6epLNKgb15UaKED2SZfDaXK89VqdVtjhBItAeBxHgEAeSulYu\nQHTGRim+vgjvkGu7oaA/icgJx9v4sujk7/jdUJ8CgYBJK3TDaGmCR2RbGPJMo7b6\nSR5yLQRc75FcjHLE5L+zpk6O+TXdaw9cBzY8bUm2nQv183tKRF6DNwqnDhmH9Iu2\nM/zv4YfCl4KVAy6qvF+/xp8Rocic5vsIOHuk+0Z7B602ItDXTGyITFPtqElqLLQU\ndWMOpcwW3QV/UCr0x7uHEg==\n-----END PRIVATE KEY-----\n",
  "client_email": "appointment-scheduler@medi-apointment-booking.iam.gserviceaccount.com",
  "client_id": "116303444256470278706",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/appointment-scheduler%40medi-apointment-booking.iam.gserviceaccount.com",
}; 

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
 email: serviceAccount.client_email,
 key: serviceAccount.private_key,
 scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZone = 'GMT';
const timeZoneOffset = '+00:00';

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  
 const agent = new WebhookClient({ request, response });
 console.log("Parameters", agent.parameters);
 const appointment_type = agent.parameters.AppointmentType;
  
  function welcome(agent) {
   agent.add(`Welcome to Medi The Chatbot!`);
 }
 
 function fallback(agent) {
   agent.add(`I didn't understand`);
   agent.add(`I'm sorry, can you try again?`);
 }

 function makeAppointment (agent) {
   // Calculate appointment start and end datetimes (end = +1hr from start)
   const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('+')[0] + timeZoneOffset));
   const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
   const appointmentTimeString = dateTimeStart.toLocaleString(
     'en-US',
     { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
   );
    // Check the availability of the time, and make an appointment if there is time on the calendar
   return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
     agent.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`);
   }).catch(() => {
     agent.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
   });
 }
  
  function cancelAppointment (agent) {
   // Calculate appointment start and end datetimes (end = +1hr from start)
   const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('+')[0] + timeZoneOffset));
   const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
   const appointmentTimeString = dateTimeStart.toLocaleString(
     'en-US',
     { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
   );
    // Check the availability of the time, and delete an appointment if it is scheduled on that particular time on the calendar
   return deleteCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
     agent.add(`I'm sorry, there was no appointment on ${appointmentTimeString}.`);
   }).catch(() => {
     agent.add(`Your appointment on ${appointmentTimeString} has been successfully cancelled!`);
   });
 }
  function rescheduleAppointment( agent){
    cancelAppointment(agent);
    makeAppointment(agent);
  }
// Handle the Dialogflow intents
 let intentMap = new Map();
 intentMap.set('Schedule Appointment', makeAppointment);
 intentMap.set('Cancel Appointment', cancelAppointment);
 intentMap.set('Default Welcome Intent', welcome);
 intentMap.set('RescheduleAppointment', rescheduleAppointment);
 intentMap.set('Default Feedback Intent', fallback);
 agent.handleRequest(intentMap);
  
});

//Creates calendar event in Google Calendar
function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
 return new Promise((resolve, reject) => {
   calendar.events.list({
     auth: serviceAccountAuth, // List events for time period
     calendarId: calendarId,
     timeMin: dateTimeStart.toISOString(),
     timeMax: dateTimeEnd.toISOString()
   }, (err, calendarResponse) => {
     // Check if there is a event already on the Calendar
     if (err || calendarResponse.data.items.length > 0) {
       reject(err || new Error('Requested time conflicts with another appointment'));
     } else {
       // Create event for the requested time period
       calendar.events.insert({ auth: serviceAccountAuth,
         calendarId: calendarId,
         resource: {summary: appointment_type +' Appointment', description: appointment_type,start: {dateTime: dateTimeStart},end: {dateTime: dateTimeEnd}}}, (err, event) => {err ? reject(err) : resolve(event);}
       );
     }
   });
 });
}

//Deletes calendar event in Google Calendar
function deleteCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
 return new Promise((resolve, reject) => {
   calendar.events.list({
     auth: serviceAccountAuth, // List events for time period
     calendarId: calendarId,
     timeMin: dateTimeStart.toISOString(),
     timeMax: dateTimeEnd.toISOString()
   }, (err, calendarResponse) => {
     // Check if there is a event already on the Calendar
     if (err || calendarResponse.data.items.length > 0) {
       // Delete event for the requested time period
       calendar.events.delete({ auth: serviceAccountAuth,
         calendarId: calendarId,
         eventId: "YzhkNmxmYjA2M2phbHY3bzZiZzcyN2dqaGcgZWQ2Mzg4OTU2MzdjOTZkZjQ0MGFlNmIyNjhjZDBiMjYzMjM4M2Q3NDBhNWFiZTNjOTQzNmU5NzQzODhiZmMzY0Bn&tmsrc=ed638895637c96df440ae6b268cd0b2632383d740a5abe3c9436e974388bfc3c%40group.calendar.google.com"}
       );
     } else {
       reject(new Error('There was no appointment on the mentioned day and time.'));
     }
   });
 });
}