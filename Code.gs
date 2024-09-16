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
  start,
  end,
  title,
  location,
  description,
  startTime,
  endTime,
  dryRun
) {
  var calendars = CalendarApp.getAllCalendars(); // Get all calendars
  var calendarId = ""; // Initially null

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      // Logger.log(
      //   'Calendar ID for "' + calendarName + '": ' + calendars[i].getId()
      // );
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Check if loop finds no calendar
  if (calendarId === "") {
    return "No \"" + calendarName + "\" calendar exists!";
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

  // Check if query finds no events
  if (events.length === 0) {
    return "No \"" + query + "\" events exist!";
  }
  // Check if queryAdd finds no events
  if (queryAdd !== "" && eventsAdd.length === 0) {
    return "No \"" + queryAdd + "\" events exist!";
  }

  // Check if query and queryAdd find no matching events below
  var match = "no";
  
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
    events.forEach(function(event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Loop through each event found, again
      eventsAdd.forEach(function(eventAdd) {
        var eventDateAdd = eventAdd.getStartTime();

        // Extract just the date part as a string, again
        eventDateAdd = eventDateAdd.toDateString();

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
            endTime,
            dryRun
          );
          match = "yes";
        }
      });
    });
    if (match === "no") {
      return "No \"" + query + "\" and \"" + queryAdd + "\" events match!";
    }
    else {
      return "Events updated!";
    }
  } else {
    // Loop through each event found
    events.forEach(function(event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Update details of events titled "New Meeting" on any letter day
      setDetails(
        event,
        eventDate,
        title,
        location,
        description,
        startTime,
        endTime,
        dryRun
      );
    });
    return "Events updated!";
  }
}

function setDetails(
  event,
  eventDate,
  title,
  location,
  description,
  startTime,
  endTime,
  dryRun
) {
  eventDate = new Date(eventDate); // Cast "eventDate" as a function

  if (!dryRun) {
    event.setTitle(title);
    event.setLocation(location);
  }

  if (!dryRun) {
    // Check if description is a link
    if (description.includes("http")) {
      event.setDescription('<a href="' + (description) + '" target="_blank" >Agenda</a>');
    } else {
      event.setDescription(description);
    }
  } 
  
  var dateStartTime = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
    startTime[0],
    startTime[1]
  );
  var dateEndTime = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
    endTime[0],
    endTime[1]
  );
  if (!dryRun) {
    event.setTime(new Date(dateStartTime), new Date(dateEndTime));
  }

  // Log which events were updated
  Logger.log("Updated an event on " + dateStartTime + ".");
}
