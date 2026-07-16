
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
