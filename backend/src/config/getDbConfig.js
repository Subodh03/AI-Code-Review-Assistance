// Resolves Postgres connection settings from environment variables.
//
// Two ways to configure it:
//   1. DATABASE_URL=postgresql://user:pass@host:port/db   (must be URL-encoded
//      if the password contains characters like @ : / # % or spaces)
//   2. Discrete PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE vars
//      (no encoding needed at all -- recommended if your password has
//      special characters, which is a common source of "Invalid URL" or
//      "ENOTFOUND" errors on Windows)
//
// If both are set, DATABASE_URL wins.
function getDbConfig() {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  if (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE) {
    return {
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE,
    };
  }

  throw new Error(
    "No database configuration found. Set either DATABASE_URL, or PGHOST/PGUSER/PGPASSWORD/PGDATABASE in your .env file."
  );
}

module.exports = { getDbConfig };
