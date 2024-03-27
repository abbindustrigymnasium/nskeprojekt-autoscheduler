const displayInformation = require("./DisplayInformation.js");

// Call fetchCurrentInformation to populate eventsList
displayInformation
  .fetchCurrentInformation()
  .then((eventsList) => {
    // Call schedule function after eventsList is populated
    schedule(eventsList);
  })
  .catch((error) => {
    console.error("Error fetching information:", error);
  });

// let events = [];
const moment = require("moment");

// Define timeframes
const TIMEFRAMES = {
  morning: { startTime: "07:00:00", endTime: "12:00:00" },
  noon: { startTime: "12:00:00", endTime: "17:00:00" },
  evening: { startTime: "17:00:00", endTime: "24:00:00" },
  fm: "morning", // fm is an alias for morning
  em: "noon",
  // Add more timeframes as needed
};

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
  // Check if eventsList is defined and is an array
  if (eventsList && Array.isArray(eventsList)) {
    console.log("Scheduling events...");

    let currentTime = moment(); // Current time

    // Calculate available time based on fixed daily schedule, commute time, and sleep duration
    const availableTimeStart = moment(
      DAILY_SCHEDULE.school.endTime,
      "HH:mm:ss"
    ).add(COMMUTE_TIME, "minutes");
    const availableTimeEnd = moment()
      .endOf("day")
      .subtract(SLEEP_DURATION, "hours");
    const availableTime = moment
      .duration(availableTimeEnd.diff(availableTimeStart))
      .asMinutes();

    eventsList.forEach((localEvent) => {
      if (localEvent.predetermined_time) {
        // If the event has a predetermined time, assign it that time
        console.log(
          `Event ${localEvent.id} scheduled at predetermined time: ${localEvent.predetermined_time}`
        );
        // Update currentTime if needed
        currentTime = moment(localEvent.predetermined_time);
      } else {
        // If the event doesn't have a predetermined time
        if (localEvent.preference !== "none") {
          // Map generalized timeframes to specific time ranges
          const preferredTimeframe = TIMEFRAMES[localEvent.preference];

          if (preferredTimeframe) {
            const preferredStartTime = moment(
              preferredTimeframe.startTime,
              "HH:mm:ss"
            );
            const preferredEndTime = moment(
              preferredTimeframe.endTime,
              "HH:mm:ss"
            );

            // Check if current time is after preferred start time and before preferred end time
            if (
              currentTime.isSameOrAfter(preferredStartTime) &&
              currentTime.isBefore(preferredEndTime)
            ) {
              // Calculate available time within the remaining time of the preferred time window
              const remainingTime = moment
                .duration(preferredEndTime.diff(currentTime))
                .asMinutes();

              // Check if event duration fits within available time
              if (
                localEvent.duration <= remainingTime &&
                localEvent.duration <= availableTime
              ) {
                // Schedule the event within the remaining time of the preferred time window
                console.log(
                  `Event ${localEvent.id} scheduled at preferred time: ${localEvent.preference}`
                );
                currentTime.add(localEvent.duration, "minutes");
                return; // Exit the loop for this event, proceed to the next event
              }
            }
          }
        }

        // If preference cannot be met or no preference is set, schedule the event as soon as possible
        console.log(
          `Event ${localEvent.id} cannot be scheduled at preferred time: ${localEvent.preference} scheduled as soon as possible`
        );
        currentTime.add(15, "minutes"); // Add a buffer time (adjust as needed)
      }
    });
  }
}
