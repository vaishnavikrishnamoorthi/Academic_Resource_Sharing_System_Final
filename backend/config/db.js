const mysql = require("mysql2/promise");

const db = mysql.createPool({
  uri: process.env.MYSQL_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = db;
