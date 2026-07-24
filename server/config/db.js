// serverless-aware driver instead of plain pg, handles connection pooling
// correctly across cold starts so we don't blow past Neon's connection limit
const path = require('path');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { WebSocket } = require('ws');
// only actually does anything locally, Vercel injects env vars directly
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

if (typeof WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = WebSocket;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to server/.env before starting the server.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// small helper so routes don't need to import pg stuff directly
module.exports = {
  query: (text, params) => pool.query(text, params),
};