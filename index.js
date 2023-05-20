function cancelAppointment(agent) {
  // Extract the appointment date and time from the agent's parameters
  const appointmentDate = agent.parameters.date;
  const appointmentTime = agent.parameters.time;

  // Query the calendar to find the corresponding event for the appointment
  const event = getAppointmentBooking(agent);

  if (event) {
    // Delete the event from the calendar
    cancelCalendarEvent(appointmentDate,appointmentTime,event.id);

    agent.add(`Your appointment on ${appointmentDate} at ${appointmentTime} has been canceled.`);
  } else {
    agent.add(`I couldn't find any appointment scheduled for ${appointmentDate} at ${appointmentTime}.`);
  }
}

function cancelCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type) {
  return new Promise((resolve, reject) => {
    calendar.events.list({
      auth: serviceAccountAuth, // List events for time period
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there is an event already on the Calendar
      if (err || calendarResponse.data.items.length > 0) {
        const event = calendarResponse.data.items.find(item => item.summary === appointment_type + ' Appointment');
        if (event) {
          // Delete event for the requested time period
          calendar.events.delete({
            auth: serviceAccountAuth,
            calendarId: calendarId,
            eventId: event.id
          }, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          });
        } else {
          reject(new Error(`There is no appointment for ${appointment_type} on the mentioned day and time.`));
        }
      } else {
        reject(new Error('There was no appointment on the mentioned day and time.'));
      }
    });
  });
}
