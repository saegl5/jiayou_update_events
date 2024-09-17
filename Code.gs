// Update 加油 ("jiā yóu") Events
// CAUTION: Event details will be overwritten.

// Search parameters
var myCalendarName = "JIA YOU"; // change name to update events on an alternate calendar, must name it differently from the owner name
var myNewQuery = "New Meeting"; // Event you want to update, query ignores any extra spacing
var myNewQueryAdd = "J Day"; // Input additional query to confine search, query ignores any extra spacing
var myNewStart = ""; // Confine date range
var myNewEnd = ""; // Confine date range
// Accepted date formats: Mmm DD YYYY, MM/DD/YYYY, DD Mmm YYYY

// Event settings
var myNewTitle = "Updated Meeting";
var myNewLocation = "Updated location";
var myNewDescription = "Updated agenda"; // string or URL, if URL then text to display will be "Agenda"
var myNewStartTime = "9:00";
var myNewEndTime = "10:00";
// Accepted time format: 24-hour
var myNewDryRun = false; // test script before running it in production





// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function updateEvents() {
  var calendarName = myCalendarName;
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
  if (myNewStart !== "" && myNewEnd !== "") {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
    myNewStart = new Date(myNewStart);
    myNewEnd = new Date(myNewEnd); // excluded from search
    myNewEnd.setDate(myNewEnd.getDate() + 1); // include end date in search

    // Search for events with title "New Meeting" between start and end dates
    var events = calendar.getEvents(myNewStart, myNewEnd, { search: query });

    // Check additional query
    if (queryAdd !== "") {
      var eventsAdd = calendar.getEvents(myNewStart, myNewEnd, { search: queryAdd });
    }
  } else {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
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
  if (myNewStartTime === "" && myNewEndTime === "") {
    myNewStartTime = "00:00";
    myNewEndTime = "24:00";
  }

  // Split strings into lists of hours and minutes
  myNewStartTime = myNewStartTime.split(":");
  myNewStartTime[0] = parseInt(myNewStartTime[0]);
  myNewStartTime[1] = parseInt(myNewStartTime[1]);

  myNewEndTime = myNewEndTime.split(":");
  myNewEndTime[0] = parseInt(myNewEndTime[0]);
  myNewEndTime[1] = parseInt(myNewEndTime[1]);

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
            myNewTitle,
            myNewLocation,
            myNewDescription,
            myNewStartTime,
            myNewEndTime,
            myNewDryRun
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
        myNewTitle,
        myNewLocation,
        myNewDescription,
        myNewStartTime,
        myNewEndTime,
        myNewDryRun
      );
    });
    return "Events updated!";
  }
}

// Set the new details for the event
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
