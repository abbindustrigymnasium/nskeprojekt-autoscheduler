const path = require("path");
const connectscripts = require(path.join(__dirname, "koppling"));
const pool = connectscripts.connect_js_to_sql();

let eventsList = []; // Declare eventsList outside the function scope

// Function to fetch and store current information from the SQL schema
function displayCurrentInformation() {
  const sql =
    "SELECT id, event_name, status, preference, duration, event_timestamp, DATE_FORMAT(predetermined_time, '%Y-%m-%d %H:%i:%s') AS predetermined_time FROM Information";

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    connection.query(sql, function (error, results) {
      connection.release();

      if (error) throw error;

      console.log("Current Information in SQL Schema:");
      console.log(results);

      // List to store objects for each row
      global.eventsList = [];

      // Display each row
      results.forEach((row) => {
        const eventObject = {
          id: row.id,
          status: row.status,
          preference: row.preference,
          duration: row.duration,
          event_name: row.event_name,
          event_timestamp: row.event_timestamp,
          predetermined_time: row.predetermined_time,
        };

        global.eventsList.push(eventObject);

        // Checking population of global.eventsList
        // console.log("pushed 1 object: ");
        // console.log(JSON.stringify(global.eventsList));

        if (row.event_timestamp !== null || row.predetermined_time !== null) {
          if (row.event_timestamp !== null) {
            console.log(
              //Event Name + event time
              ` ${row.event_name} :   ${row.event_timestamp.toLocaleString()}`
            );
          } else {
            console.log(
              ` ${row.event_name} : ${row.predetermined_time.toLocaleString()}`
            );
          }
        } else {
          console.log(`${row.event_name} : currently no determined time`);
        }
      });

      // Use eventsList as needed, containing objects for each row
      console.log(global.eventsList);
    });
  });
}

displayCurrentInformation();
