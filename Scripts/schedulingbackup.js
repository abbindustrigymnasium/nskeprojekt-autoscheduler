const path = require("path");
const connectscripts = require(path.join(__dirname, "koppling"));
const pool = connectscripts.connect_js_to_sql();

// Function to fetch and store current information from the SQL schema
function fetchCurrentInformation() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, event_name, status, preference, duration, event_timestamp, DATE_FORMAT(predetermined_time, '%Y-%m-%d %H:%i:%s') AS predetermined_time FROM Information";

    pool.getConnection(function (err, connection) {
      if (err) return reject(err);

      connection.query(sql, function (error, results) {
        connection.release();

        if (error) return reject(error);

        let eventsList = results.map((row) => ({
          id: row.id,
          status: row.status,
          preference: row.preference,
          duration: row.duration,
          event_name: row.event_name,
          event_timestamp: row.event_timestamp,
          predetermined_time: row.predetermined_time,
        }));

        resolve(eventsList);
      });
    });
  });
}

fetchCurrentInformation();

module.exports = {
  fetchCurrentInformation,
};
