// Modify the search query, event title, description, start time, and end time as desired

var myNewQuery = "New Meeting"; // Query ignores any extra spacing
var myNewTitle = "Updated Meeting";
var myLocation = "Updated location";
var myNewDescription = "Updated agenda";
var myNewStartTime = [9, 0]; // Means 9:00, use 24-hour time format
var myNewEndTime = [10, 0]; // Means 10:00, use 24-hour time format



// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function updateEvents() {
  var calendarName = "JIA YOU";
  var calendars = CalendarApp.getAllCalendars();  // Get all calendars
  
  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      Logger.log('Calendar ID for "' + calendarName + '": ' + calendars[i].getId());
      var calendarID = String(calendars[i].getId());  // Assign the calendar ID
    }
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarID);
  
  // Set the search parameters
  var query = myNewQuery;
  var now = new Date();
  var oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  // Search for events with title "New Meeting" between now and one year from now
  var events = calendar.getEvents(now, oneYearFromNow, {search: query});
  
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
    Logger.log('Updated an event on ' + startTime + '.');

  }); 
}