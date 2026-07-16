const { Pool } = require("pg");
const { getDbConfig } = require("./getDbConfig");

const pool = new Pool(getDbConfig());

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
  process.exit(1);
});

module.exports = pool;
