/**
 * @file Database helper module.
 * @brief Creates a PostgreSQL connection pool and exports a query helper.
 */
const { Pool } = require('pg');
require('dotenv').config();

/**
 * @brief PostgreSQL connection pool.
 * Uses the DATABASE_URL environment variable from the project .env.
 */
// Initialize the connection pool using your environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export a query helper function
module.exports = {
  query: (text, params) => pool.query(text, params),
};