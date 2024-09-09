// Modify the calendar name, search query, event title, location, description, myNewStart time, and myNewEnd time as desired
// CAUTION: Event details will be overwritten.

var myCalendarName = "JIA YOU"; // change name to update events on an alternate calendar, must name it differently from the owner name
var myNewQuery = "New Meeting"; // Query ignores any extra spacing
var myNewQueryAdd = "J Day"; // Query ignores any extra spacing, input additional query to confine search
var myNewTitle = "Updated Meeting";
var myLocation = "Updated location";
var myNewDescription = "Updated agenda";
var myNewStart = ""; // Confine date range
var myNewEnd = ""; // Confine date range
var myNewStartTime = "9:00";
var myNewEndTime = "10:00";
// Accepted date formats: Mmm DD YYYY; MM/DD/YYYY; DD Mmm YYYY
// Accepted time format: 24-hour



// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function updateEvents() {
  var calendarName = myCalendarName;
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

  // Check for null dates
  if (myNewStart !== "" && myNewEnd !== "") {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
    myNewStart = new Date(myNewStart);
    myNewEnd = new Date(myNewEnd); // excluded from search
    myNewEnd.setDate(myNewEnd.getDate() + 1); // include end date in search

    // Search for events with title "New Meeting" between start and end dates
    var events = calendar.getEvents(myNewStart, myNewEnd, {search: query});

    // Check additional query
    if (queryAdd !== "") {
      var eventsAdd = calendar.getEvents(myNewStart, myNewEnd, {search: queryAdd});
    }
  } else {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events with title "New Meeting" between now and one year from now
    var events = calendar.getEvents(now, oneYearFromNow, {search: query});

    // Check additional query
    if (queryAdd !== "") {
      var eventsAdd = calendar.getEvents(now, oneYearFromNow, {search: queryAdd});
    }
  }
  
  // Check if times are null
  if (myNewStartTime === "" && myNewEndTime === "") {
    myNewStartTime = "00:00";
    myNewEndTime = "24:00";
  }
  
  // Split strings into lists of hours and minutes
  myNewStartTime = myNewStartTime.split(':');
  myNewStartTime[0] = parseInt(myNewStartTime[0]);
  myNewStartTime[1] = parseInt(myNewStartTime[1]);

  myNewEndTime = myNewEndTime.split(':');
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
            myLocation,
            myNewDescription,
            myNewStartTime,
            myNewEndTime
          );
        }
      });
    });
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
  event.setTime(new Date(dateStartTime), new Date(dateEndTime));

  // Log which events were updated
  Logger.log("Updated an event on " + dateStartTime + ".");
}
