// Initializes the database by running schema.sql through the same `pg`
// library the app already uses. This exists so Windows users (and anyone
// without psql on their PATH) don't need the psql CLI at all --
// `npm run db:init` is enough.

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const { getDbConfig } = require("../config/getDbConfig");

async function main() {
  let config;
  try {
    config = getDbConfig();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  const client = new Client(config);

  console.log(`Connecting to ${describeConfig(config)} ...`);

  try {
    await client.connect();
  } catch (err) {
    console.error("\nCould not connect to Postgres.");
    console.error(`Reason: ${err.message}`);
    console.error("\nCheck that:");
    console.error("  1. Postgres is running");
    console.error("  2. The database already exists (create it first, e.g. `createdb code_review_assistant`)");
    console.error("  3. The username/password/host/port are correct");
    console.error(
      "\nTip: if your password contains characters like @ : / # % or a space, using DATABASE_URL\n" +
      "requires URL-encoding them. Switching to discrete PGHOST/PGUSER/PGPASSWORD/PGDATABASE\n" +
      "variables in your .env avoids that problem entirely -- see .env.example."
    );
    process.exit(1);
  }

  try {
    await client.query(schemaSql);
    console.log("Schema applied successfully.");

    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log("Tables now in the database:", result.rows.map((r) => r.table_name).join(", "));
  } catch (err) {
    console.error("Failed while running schema.sql:");
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

function describeConfig(config) {
  if (config.connectionString) {
    return config.connectionString.replace(/(postgresql:\/\/[^:]+:)[^@]+(@)/, "$1****$2");
  }
  return `${config.user}@${config.host}:${config.port}/${config.database}`;
}

main();
