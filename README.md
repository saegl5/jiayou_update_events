# Update 加油 ("jiā yóu") Events

Google Apps Script for batch updating events on only certain letter days (e.g., on only "J Day's"). Modify as needed, and back up your calendars before you run the script. These events are not recurring events, so without a batch script one would need to update these events manually.

```
CAUTION: Event details will be overwritten.
```

## Visual Example

<img src="screenshots/calendarForm.png" alt="screenshot of calendar form" width="800"><br>Form for updating "JIA YOU" events.

<img src="screenshots/calendar.png" alt="screenshot of calendar" width="800"><br>Event titles changed from "New Meeting" to "Updated Meeting," and start times changed from 10 AM to 9 AM. (See [here](https://github.com/saegl5/jiayou_add_events) how the events appeared before updating them.)

## Getting Started

1. Go to [Google Apps Script](https://script.google.com/), and create a new project.
2. Copy and paste [the script](./Code.gs) into the editor, and save the file.
3. Create an HTML file, and name it "Index."
4. Copy and paste [the markup text](./Index.html) into the editor, and save the file.
5. Deploy the project as a Web app, and open the assigned URL.
6. Modify the calendar name, search query, events' title, location, description, start time, and end time. (Modifying the calendar name is recommended, if you had created events on an alternate calendar. ***Must name the calendar differently from the owner name, otherwise the script will not update events.***)
7. Press submit. (Requires permission to make changes to events and authorization. ***Note also that updating calendar events may be subject to a [use limit](https://support.google.com/a/answer/2905486?hl=en).***)

## Known Issue

Deploying the project as a Web app should, but does not always, grant the app authorization. You may need to run the script manually, then re-open the assigned URL.

<hr>
Made with &heartsuit; in Visual Studio Code