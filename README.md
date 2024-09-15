# Update 加油 ("jiā yóu") Events

Google Web app for batch updating events on only certain letter days (e.g., on only "J Day's"). Modify as needed, and back up your calendars before you run the app. These events are not recurring events, so without a batch script one would need to update these events manually.

```
CAUTION: Event details will be overwritten.
```

## Visual Example

<img src="screenshots/calendarForm.png" alt="screenshot of calendar form" width="800"><br>Form for updating "JIA YOU" events.

<img src="screenshots/calendar.png" alt="screenshot of calendar" width="800"><br>Event titles changed from "New Meeting" to "Updated Meeting," and start times changed from 10 AM to 9 AM. (See [here](https://github.com/saegl5/jiayou_add_events) how the events appeared before updating them.)

## Getting Started

1. Go to [Google Apps Script](https://script.google.com/), and create a new project.
2. Copy and paste [the script](./Code.gs) into the editor, and save the file.
3. Run the script to acquire authorization.
4. Create an HTML file, and name it "Index."
5. Copy and paste [the markup text](./Index.html) into the editor, and save the file.
6. Deploy the project as a Web app, and open the assigned URL.
7. Modify the calendar name, search query, events' title, location, description, start time, and end time. (Modifying the calendar name is recommended, if you had created events on an alternate calendar. **_Must name the calendar differently from the owner name, otherwise the app will not update events._** If you input a URL for the description, text to display will be "Agenda.")
8. Confine the search by inputting an additional query.
9. Confine the date range by inputting a start date and end date.
10. Press submit. (Requires permission to make changes to events and another authorization. **_Note also that updating calendar events may be subject to a [use limit](https://support.google.com/a/answer/2905486?hl=en)._**)

<hr>
Made with &heartsuit; in Visual Studio Code
