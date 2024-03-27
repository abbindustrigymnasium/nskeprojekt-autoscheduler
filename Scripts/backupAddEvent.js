//const readline = require("readline");
const path = require("path");
const connectscripts = require(path.join(__dirname, "koppling"));
const pool = connectscripts.connect_js_to_sql();

function addEvent() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let custom_event_name;
  let custom_status;
  let custom_preference;
  let custom_duration;
  let custom_event_timestamp;

  function askEventName() {
    rl.question("Enter name of event:", (event_name) => {
      if (event_name !== "") {
        custom_event_name = event_name;
        askStatus();
      } else {
        askEventName(); // Repeat the question if input is empty
      }
    });
  }

  function askStatus() {
    rl.question("Enter status of event (dynamic or static):", (status) => {
      if (status !== "") {
        custom_status = status;
      }
      askPreference();
    });
  }

  function askPreference() {
    rl.question(
      "Enter preference of event (evening, noon, or afternoon):",
      (preference) => {
        if (preference !== "") {
          custom_preference = preference;
        }
        askDuration();
      }
    );
  }

  function askDuration() {
    rl.question("Duration of event (in minutes):", (duration) => {
      if (duration !== "") {
        custom_duration = parseInt(duration);
      }
      askTimestamp();
    });
  }

  function askTimestamp() {
    rl.question(
      "Add date for event in the following format (2024-01-16 14:45:00):",
      (timestamp) => {
        if (timestamp !== "") {
          custom_event_timestamp = timestamp;
        }
        setValues();
      }
    );
  }

  function setValues() {
    const customValues = {
      event_name: custom_event_name,
      status: custom_status,
      preference: custom_preference,
      duration: custom_duration,
      event_timestamp:
        custom_event_timestamp !== "" ? custom_event_timestamp : null,
    };

    const validValues = Object.fromEntries(
      Object.entries(customValues).filter(
        ([key, value]) => value !== null && value !== undefined
      )
    );

    const placeholders = Object.keys(validValues)
      .map(() => "?")
      .join(", ");

    const sql = `INSERT INTO Information (${Object.keys(validValues).join(
      ", "
    )}) VALUES (${placeholders})`;

    const values = Object.values(validValues);

    pool.getConnection(function (err, connection) {
      if (err) throw err;

      connection.query(sql, values, function (error, results) {
        connection.release();

        if (error) throw error;

        console.log("Event added successfully.");

        // Continue the event creation loop
        askEventName();
      });
    });
  }

  // Close the readline interface after completing the entire event creation process
  rl.on("close", function () {
    console.log("Readline interface closed.");
  });

  askEventName();
}

if (typeof readline !== "undefined") {
  addEvent();
} else {
  console.log("Readline is not available");
}
