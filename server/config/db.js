// serverless-aware driver instead of plain pg, handles connection pooling
// correctly across cold starts so we don't blow past Neon's connection limit
const { Pool } = require('@neondatabase/serverless');
// only actually does anything locally, Vercel injects env vars directly
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// small helper so routes don't need to import pg stuff directly
module.exports = {
  query: (text, params) => pool.query(text, params),
};