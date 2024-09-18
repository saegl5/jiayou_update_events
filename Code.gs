// Update 加油 ("jiā yóu") Events
// CAUTION: Event details will be overwritten.
// Modify the following search parameters and event settings, then press |> Run

// Search parameters
var myCalendarName = "JIA YOU"; // change name to update events on an alternate calendar, must name it differently from the owner name
var myNewQuery = "New Meeting"; // Event you want to update
var myNewQueryAdd = "J Day"; // Input additional query to confine search
var myNewStart = ""; // Confine date range
var myNewEnd = ""; // Confine date range
// Accepted date formats: Mmm DD YYYY, MM/DD/YYYY, DD Mmm YYYY
// Why not accept YYYY/MM/DD ? Because it defaults to Coordinated Universal Time

// Event settings
var myNewTitle = "Updated Meeting";
var myGuestsAdd = ""; // add a guest, comma-separated list of email addresses
// send invitation emails manually
var myGuestsDel = ""; // remove a guest, comma-separated list of email addresses, ignores guest if their email address is not found
var myNewLocation = "Updated location";
var myNewDescription = "Updated agenda"; // string or URL, if URL then text to display will be "Agenda"
var myNewStartTime = "9:00";
var myNewEndTime = "10:00";
// Accepted time format: 24-hour
var myNewDryRun = false; // test script before running it in production





// -----------------------------------------------------------------------------------
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
    Logger.log('No "' + calendarName + '" calendar exists!');
    return null;
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
    var eventsAll = calendar.getEvents(myNewStart, myNewEnd);
    var events = [];
    for (var j = 0; j < eventsAll.length; j++) {
      var event = eventsAll[j];
      if (event.getTitle() === query) {
        // MORE RELIABLE!
        events.push(event);
      }
    }

    // Check additional query
    if (queryAdd !== "") {
      var eventsAddAll = calendar.getEvents(myNewStart, myNewEnd);
      var eventsAdd = [];
      for (var k = 0; k < eventsAddAll.length; k++) {
        var event = eventsAddAll[k];
        if (event.getTitle() === queryAdd) {
          eventsAdd.push(event);
        }
      }
    }
  } else {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events with title "New Meeting" between now and one year from now
    var eventsAll = calendar.getEvents(now, oneYearFromNow);
    var events = [];
    for (var l = 0; l < eventsAll.length; l++) {
      var event = eventsAll[l];
      if (event.getTitle() === query) {
        events.push(event);
      }
    }

    // Check additional query
    if (queryAdd !== "") {
      var eventsAddAll = calendar.getEvents(now, oneYearFromNow);
      var eventsAdd = [];
      for (var m = 0; m < eventsAddAll.length; m++) {
        var event = eventsAddAll[m];
        if (event.getTitle() === queryAdd) {
          eventsAdd.push(event);
        }
      }
    }
  }

  // Check if query finds no events
  if (events.length === 0) {
    Logger.log('No "' + query + '" events exist!');
    return null;
  }
  // Check if queryAdd finds no events
  if (queryAdd !== "" && eventsAdd.length === 0) {
    Logger.log('No "' + queryAdd + '" events exist!');
    return null;
  }

  // Check if query and queryAdd find no matching events below
  var match = false;

  // Process each guest list
  if (myGuestsAdd !== "") {
    myGuestsAdd = myGuestsAdd.split(", ");
  }
  if (myGuestsDel !== "") {
    myGuestsDel = myGuestsDel.split(", ");
  }

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
    events.forEach(function (event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Loop through each event found, again
      eventsAdd.forEach(function (eventAdd) {
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
            myGuestsAdd,
            myGuestsDel,
            myNewLocation,
            myNewDescription,
            myNewStartTime,
            myNewEndTime,
            myNewDryRun
          );
          match = true;
        }
      });
    });
    if (match === false) {
      Logger.log('No "' + query + '" and "' + queryAdd + '" events match!');
      return null;
    } else {
      Logger.log("Events updated!");
      return null;
    }
  } else {
    // Loop through each event found
    events.forEach(function (event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Update details of events titled "New Meeting" on any letter day
      setDetails(
        event,
        eventDate,
        myNewTitle,
        myGuestsAdd,
        myGuestsDel,
        myNewLocation,
        myNewDescription,
        myNewStartTime,
        myNewEndTime,
        myNewDryRun
      );
    });
    Logger.log("Events updated!");
    return null;
  }
}

// Set the new details for the event
function setDetails(
  event,
  eventDate,
  title,
  guestsAdd,
  guestsDel,
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

  if (guestsAdd.length !== 0 && !dryRun) {
    for (var n = 0; n < guestsAdd.length; n++) {
      event.addGuest(String(guestsAdd[n]));
    }
  }

  if (guestsDel.length !== 0 && !dryRun) {
    for (var o = 0; o < guestsDel.length; o++) {
      event.removeGuest(String(guestsDel[o]));
    }
  }

  if (!dryRun) {
    // Check if description is a link
    if (description.includes("http")) {
      event.setDescription(
        '<a href="' + description + '" target="_blank" >Agenda</a>'
      );
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
  return null;
}
