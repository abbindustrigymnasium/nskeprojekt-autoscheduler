const displayInformation = require("./DisplayInformation.js");

/// Define timeframes
const TIMEFRAMES = {
  morning: { startTime: "07:00:00", endTime: "12:00:00" },
  noon: { startTime: "12:00:00", endTime: "17:00:00" },
  evening: { startTime: "17:00:00", endTime: "24:00:00" },
  // fm and em will be assigned later
};

// Assign references to fm and em
TIMEFRAMES.fm = TIMEFRAMES.morning; // Assign reference to the morning timeframe
TIMEFRAMES.em = TIMEFRAMES.noon; // Assign reference to the noon timeframe

// Call fetchCurrentInformation to populate eventsList
displayInformation
  .fetchCurrentInformation()
  .then((eventsList) => {
    // Call schedule function after eventsList is populated
    schedule(eventsList); // Pass eventsList to the schedule function
  })
  .catch((error) => {
    console.error("Error fetching information:", error);
  });

// let events = [];
const moment = require("moment");

// Define fixed daily schedule
const DAILY_SCHEDULE = {
  school: { startTime: "08:00:00", endTime: "09:00:00" },
  // Add more fixed daily schedules as needed
};

// Define commute time (in minutes)
const COMMUTE_TIME = 5; // Example: 30 minutes

// Define sleep duration (in hours)
const SLEEP_DURATION = 6; // Example: 8 hours

function schedule(eventsList) {
  // Existing code

  eventsList.forEach((localEvent) => {
    console.log("\nProcessing Event:", localEvent);

    // If the event doesn't have a predetermined time
    if (!localEvent.predetermined_time && localEvent.preference !== "none") {
      // Map generalized timeframes to specific time ranges
      const preferredTimeframe = TIMEFRAMES[localEvent.preference];

      console.log("Preferred Timeframe:", preferredTimeframe);

      if (preferredTimeframe) {
        const startTimeString = preferredTimeframe.startTime;
        const endTimeString = preferredTimeframe.endTime;

        // Check if start and end times are defined
        if (startTimeString && endTimeString) {
          const preferredStartTime = moment(startTimeString, "HH:mm:ss");
          const preferredEndTime = moment(endTimeString, "HH:mm:ss");

          // Check if moment objects are valid
          if (preferredStartTime.isValid() && preferredEndTime.isValid()) {
            console.log(
              "Preferred Start Time:",
              preferredStartTime.format("HH:mm:ss")
            );
            console.log(
              "Preferred End Time:",
              preferredEndTime.format("HH:mm:ss")
            );

            // Calculate available time within the preferred time frame
            const availableTimeInPreferredTimeframe = moment
              .duration(preferredEndTime.diff(preferredStartTime))
              .asMinutes();

            console.log(
              "Available Time in Preferred Timeframe (minutes):",
              availableTimeInPreferredTimeframe
            );

            // Check if event duration fits within available time in the preferred time frame
            if (localEvent.duration <= availableTimeInPreferredTimeframe) {
              // Schedule the event within the preferred time frame

              // Calculate the scheduled time within the preferred time frame
              const scheduledTime = preferredStartTime
                .clone()
                .add(30, "minutes"); // Adjust this as needed
              // Update the event_timestamp to the scheduled time
              localEvent.event_timestamp = scheduledTime.format();

              console.log(
                `Event ${localEvent.id} scheduled at:`,
                scheduledTime.format("YYYY-MM-DD HH:mm:ss")
              );

              // Move currentTime forward by event duration
              currentTime = scheduledTime
                .clone()
                .add(localEvent.duration, "minutes");

              return; // Exit the loop for this event, proceed to the next event
            }
          } else {
            console.error("Invalid start or end time format");
          }
        } else {
          console.error("Start or end time is undefined");
        }
      }
    }

    // Existing code
  });
}
