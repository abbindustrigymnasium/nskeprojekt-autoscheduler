const readline = require("readline");
const path = require("path");
const connectscripts = require(path.join(__dirname, "koppling"));
const pool = connectscripts.connect_js_to_sql();

// Check if readline is available
if (typeof readline !== "undefined") {
  // Use readline
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function addEvent() {
    let custom_event_name;
    let custom_status;
    let custom_preference;
    let custom_duration;
    let custom_predetermined_time;

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
        askPredetermined_time();
      });
    }

    function askPredetermined_time() {
      rl.question(
        "Already know when to schedule event? No: Press enter, Yes: Add the date here in the following format [2024-01-18 14:45:00]:  ",
        (predetermined_time) => {
          if (predetermined_time !== "") {
            custom_predetermined_time = predetermined_time;
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
        predetermined_time: custom_predetermined_time,
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

          // Close the readline interface after completing the entire event creation process
          rl.close();
        });
      });
    }

    // Close the readline interface after completing the entire event creation process
    rl.on("close", function () {
      console.log("Readline interface closed.");
    });

    askEventName();
  }

  // Call the function to add an event
  addEvent();
} else {
  // If readline is not available, display current information
  console.log("Readline is not available");
}
