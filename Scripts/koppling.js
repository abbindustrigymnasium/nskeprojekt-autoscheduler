// Access mysql database by using mysql2
const mysql = require("mysql2");

function connect_js_to_sql() {
  // Create a connection pool
  const pool = mysql.createPool({
    host: "localhost",
    user: "mysqlUser",
    password: "HamletochMerlin8@",
    database: "autoscheduler",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}
module.exports = {
  connect_js_to_sql,
};
