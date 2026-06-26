const { Pool } = require('pg');
require('dotenv').config();

// Initialize the connection pool using your environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export a query helper function
module.exports = {
  query: (text, params) => pool.query(text, params),
};