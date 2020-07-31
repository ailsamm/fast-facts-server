require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  validateChecksums: false,
  "connectionString": (process.env.NODE_ENV === 'test')
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  "rejectUnauthorized": false,
  "ssl": !!process.env.SSL,
};