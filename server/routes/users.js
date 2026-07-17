const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/sync", async (req, res) => {
  try {
    const auth0Id = req.body?.auth0Id || req.body?.sub || req.body?.auth0_id;
    const email = req.body?.email || null;
    const displayName = req.body?.display_name || req.body?.name || null;

    if (!auth0Id) {
      return res.status(400).json({ error: "Missing auth0Id" });
    }

    const result = await db.query(
      `
        INSERT INTO users (auth0_id, email, display_name, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        ON CONFLICT (auth0_id) DO UPDATE SET
          email = EXCLUDED.email,
          display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), users.display_name),
          updated_at = NOW()
        RETURNING id, auth0_id, email, display_name, created_at, updated_at;
      `,
      [auth0Id, email, displayName],
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Failed to sync user:", err.message);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

/**
 * @brief Get all users
 * @route GET /api/users
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        email,
        display_name,
        session_length_minutes,
        challenge_difficulty,
        preferred_challenge_types,
        xp,
        challenges_completed,
        current_streak,
        longest_streak,
        created_at,
        updated_at
      FROM users
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to get users:", err.message);
    res.status(500).json({ error: "Failed to get users" });
  }
});

module.exports = router;
