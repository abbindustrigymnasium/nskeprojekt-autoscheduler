const displayInformation = require("./DisplayInformation.js");
const {
  checkStatus,
  checkPredeterminedTime,
  checkPreference,
  checkDuration,
} = require("./EventUtils.js");

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

function schedule(eventsList) {
  // Check if eventsList is defined and is an array
  if (eventsList && Array.isArray(eventsList)) {
    console.log("Scheduling events...");
    eventsList.forEach((localEvent) => {
      const statusCheck = checkStatus(localEvent);
      const predeterminedTimeCheck = checkPredeterminedTime(localEvent);
      const preferenceCheck = checkPreference(localEvent);
      const durationCheck = checkDuration(localEvent);

      if (statusCheck) {
        console.log("Status is dynamic");
      }
      if (predeterminedTimeCheck) {
        console.log("Predetermined time is not null");
      }
      if (preferenceCheck) {
        console.log("Preference is not none");
      }
      if (durationCheck) {
        console.log("Duration is not null");
      }
      if (
        !statusCheck &&
        !predeterminedTimeCheck &&
        !preferenceCheck &&
        !durationCheck
      ) {
        console.log("Everything is dynamic");
      }
    });
    console.log("Scheduling completed.");
  } else {
    console.log("eventsList is not defined or not an array.");
  }
}

//duration, event_name, event_timestamp, id, predetermined_time, preference, status,

// if(check if fixed timeout -> assign time,
// not fixed time -> check prefered time,
// if prefered time = free and time required<= time available, set event to sometime during prefered time
// sometime? minimising extended break times/ consideration to break between different ativities
//
