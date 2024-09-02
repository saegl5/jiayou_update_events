# Update 加油 ("jiā yóu") Events

Google Apps Script for batch updating events. Modify as needed.

## Visual Example

<img src="screenshots/calendar.png" alt="screenshot of calendar" width="800"><br>Event titles changed from "New Meeting" to "Updated Meeting," and start times changed from 10am to 9am. (See [here](https://github.com/saegl5/jiayou_create_events) how the events appeared before updating them.)

## Getting Started

1. Go to [Google Apps Script](https://script.google.com/), and create a new project.
2. Copy and paste [the script](./Code.gs) into the editor.
3. Modify the calendar name. (By default, it is "JIA YOU." Recommended, if you had created events on an alternate calender.  ***Must name it differently from the owner name, otherwise the script will not update events.***)
4. Modify the search query. (By default, it is "New Meeting." Specifically, `myNewQuery = "New Meeting";`)
5. Modify the events' title, location, description, start time, and end time. (By default, events are newly titled "Updated Meeting," located at "Updated location," described as "Updated agenda," start at 9am, and end at 10am.)
6. Save and run the script. (Requires permission to make changes to events and authorization. ***Note also that updating calendar events may be subject to a [use limit](https://support.google.com/a/answer/2905486?hl=en).***)

### Web App

To deploy the project as a web app, please consult the [development branch](https://github.com/saegl5/jiayou_update_events/tree/development).

<hr>
Made with &heartsuit; in Visual Studio Code