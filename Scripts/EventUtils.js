// EventUtils.js

// Function to check if event status is dynamic
function checkStatus(localEvent) {
  return localEvent.status === "dynamic";
}

// Function to check if event has a predetermined time
function checkPredeterminedTime(localEvent) {
  return localEvent.predetermined_time !== null;
}

// Function to check if event has a preference set
function checkPreference(localEvent) {
  // Assume that the preferred time is considered valid if it's not "none"
  return localEvent.preference !== "none";
}

// Function to check if event duration is not null
function checkDuration(localEvent) {
  // Add your logic to check if the duration is within acceptable limits
  return localEvent.duration !== null && !isNaN(localEvent.duration);
}

module.exports = {
  checkStatus,
  checkPredeterminedTime,
  checkPreference,
  checkDuration,
};
