// const config = require("./config")
const initOptions = {
  connect(client) {
    const cp = client.connectionParameters;
    console.log('Connected to database:', cp.database);
  },
  query(e) {
    console.log('DB QUERY:', e.query);
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    console.log('Disconnecting from database:', cp.database);
  },
};

const pgp = require('pg-promise')(initOptions);

const CONNECTION = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "requestbin",
  allowExitOnIdle: true,
  // username: config.DB_USERNAME,
  // password: config.DB_PASSWORD,
  // database: config.DB_NAME
};

const db = pgp(CONNECTION);

module.exports = { db };
