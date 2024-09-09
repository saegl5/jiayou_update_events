// CAUTION: Event details will be overwritten.

// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index");
}

function updateEvents(
  calendarName,
  query,
  queryAdd,
  title,
  location,
  description,
  start,
  end,
  startTime,
  endTime
) {
  var calendars = CalendarApp.getAllCalendars(); // Get all calendars

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      Logger.log(
        'Calendar ID for "' + calendarName + '": ' + calendars[i].getId()
      );
      var calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);

  // Check for null dates
  if (start !== "" && end !== "") {
    // Set the search parameters
    start = new Date(start);
    end = new Date(end); // excluded from search
    end.setDate(end.getDate() + 1); // include end date in search

    // Search for events with title "New Meeting" between start and end dates
    var events = calendar.getEvents(start, end, { search: query });

    // Check additional query
    if (queryAdd !== "") {
      var eventsAdd = calendar.getEvents(start, end, { search: queryAdd });
    }
  } else {
    // Set the search parameters
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events with title "New Meeting" between now and one year from now
    var events = calendar.getEvents(now, oneYearFromNow, { search: query });

    // Check additional query
    if (queryAdd !== "") {
      var eventsAdd = calendar.getEvents(now, oneYearFromNow, {
        search: queryAdd,
      });
    }
  }

  // Check if times are null
  if (startTime === "" && endTime === "") {
    startTime = "00:00";
    endTime = "24:00";
  }

  // Split strings into lists of hours and minutes
  startTime = startTime.split(":");
  startTime[0] = parseInt(startTime[0]);
  startTime[1] = parseInt(startTime[1]);

  endTime = endTime.split(":");
  endTime[0] = parseInt(endTime[0]);
  endTime[1] = parseInt(endTime[1]);

  if (queryAdd !== "") {
    // Loop through each event found
    events.forEach(function (event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      var eventDate = eventDate.toDateString();

      // Loop through each event found, again
      eventsAdd.forEach(function (eventAdd) {
        var eventDateAdd = eventAdd.getStartTime();

        // Extract just the date part as a string, again
        var eventDateAdd = eventDateAdd.toDateString();

        // Find matches
        if (eventDate === eventDateAdd) {
          // Update details of events titled "New Meeting" on "J Day"
          setDetails(
            event,
            eventDate,
            title,
            location,
            description,
            startTime,
            endTime
          );
        }
      });
    });
  } else {
    // Loop through each event found
    events.forEach(function (event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      var eventDate = eventDate.toDateString();

      // Update details of events titled "New Meeting" on any letter day
      setDetails(
        event,
        eventDate,
        title,
        location,
        description,
        startTime,
        endTime
      );
    });
  }
  return "Events updated!";
}

function setDetails(
  event,
  eventDate,
  title,
  location,
  description,
  startTime,
  endTime
) {
  eventDate = new Date(eventDate); // Cast "eventDate" as a function
  event.setTitle(title);
  event.setLocation(location);
  event.setDescription(description);
  var dateStartTimeAdd = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
    startTime[0],
    startTime[1]
  );
  var dateEndTimeAdd = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
    endTime[0],
    endTime[1]
  );
  event.setTime(new Date(dateStartTimeAdd), new Date(dateEndTimeAdd));

  // Log which events were updated
  Logger.log("Updated an event on " + dateStartTimeAdd + ".");
}
