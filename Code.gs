// Modify the calendar name, search query, event title, location, description, start time, and end time as desired
// CAUTION: Event details will be overwritten.

var myCalendarName = "JIA YOU"; // change name to update events on an alternate calendar, must name it differently from the owner name
var myNewQuery = "New Meeting"; // Query ignores any extra spacing
var myNewTitle = "Updated Meeting";
var myLocation = "Updated location";
var myNewDescription = "Updated agenda";
var myNewStart = ""; // Confine date range
var myNewEnd = ""; // Confine date range
var myNewStartTime = "9:00 AM";
var myNewEndTime = "10:00 AM";
// Accepted date formats: Mmm DD YYYY; MM/DD/YYYY; DD Mmm YYYY
// Accepted time formats: 12-hour am/pm, 24-hour



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
    myNewStart = new Date(myNewStart);
    myNewEnd = new Date(myNewEnd); // excluded from search
    myNewEnd.setDate(myNewEnd.getDate() + 1); // include end date in search

    // Search for events with title "New Meeting" between start and end dates
    var events = calendar.getEvents(myNewStart, myNewEnd, {search: query});
  }
  else {
    // Set the search parameters
    var query = myNewQuery;
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);
    
    // Search for events with title "New Meeting" between now and one year from now
    var events = calendar.getEvents(now, oneYearFromNow, {search: query});
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
  
  // Loop through each event found
  events.forEach(function(event) {
    var eventDate = event.getStartTime();

    // Extract just the date part (YYYY-MM-DD) as a string
    eventDate = eventDate.toDateString(); // Not storing the date in a dictionary

    // Cast "eventDate" as a function
    eventDate = new Date(eventDate);

    // Set the new details for the event
    event.setTitle(myNewTitle);
    event.setLocation(myLocation);
    event.setDescription(myNewDescription);
    var startTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), myNewStartTime[0], myNewStartTime[1]);
    var endTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), myNewEndTime[0], myNewEndTime[1]);
    event.setTime(new Date(startTime), new Date(endTime));

    // Log which events were updated
    Logger.log("Updated an event on " + startTime + ".");

  }); 
}