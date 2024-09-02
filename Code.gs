// CAUTION: Event details will be overwritten.

// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
}

function updateEvents(calendarName, query, title, location, description, startTime, endTime) {
  var calendars = CalendarApp.getAllCalendars();  // Get all calendars
  
  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      Logger.log("Calendar ID for \"" + calendarName + "\": " + calendars[i].getId());
      var calendarId = String(calendars[i].getId());  // Assign the calendar ID
    }
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);

  // Set the search parameters
  var now = new Date();
  var oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  // Search for events with title "New Meeting" between now and one year from now
  var events = calendar.getEvents(now, oneYearFromNow, {search: query});
  
  // Check if times are null
  if (myNewStartTime === "" && myNewEndTime === "") {
    myNewStartTime = "00:00";
    myNewEndTime = "24:00";
  }
  
  // Split strings into lists of hours and minutes
  startTime = startTime.split(':');
  startTime[0] = parseInt(startTime[0]);
  startTime[1] = parseInt(startTime[1]);

  endTime = endTime.split(':');
  endTime[0] = parseInt(endTime[0]);
  endTime[1] = parseInt(endTime[1]);
  
  // Loop through each event found
  events.forEach(function(event) {
    var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Update details of events titled "New Meeting" on any letter day
      setDetails(
        event,
        eventDate,
        myNewTitle,
        myLocation,
        myNewDescription,
        myNewStartTime,
        myNewEndTime
      );
    });
  }
  return "Events updated!";
}

    // Set the new details for the event
    event.setTitle(title);
    event.setLocation(location);
    event.setDescription(description);
    var dateStartTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), startTime[0], startTime[1]);
    var dateEndTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), endTime[0], endTime[1]);
    event.setTime(new Date(dateStartTime), new Date(dateEndTime));

    // Log which events were updated
    Logger.log("Updated an event on " + dateStartTime + ".");

  });
  return "Events updated!";
}
