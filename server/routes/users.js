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
 * @brief Get all users (for testing purposes).
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

/**
 * @brief Get user preferences by auth0Id.
 * @route GET /api/users/preferences?auth0Id=<auth0Id>
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
router.get("/preferences", async (req, res) => {
  const auth0Id = req.query.auth0Id;

  if (!auth0Id) {
    return res.status(400).json({ error: "Missing auth0Id" });
  }

  try {
    const result = await db.query(
      `
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
      WHERE auth0_id = $1
      LIMIT 1;
    `,
      [auth0Id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Failed to get user preferences:", err.message);
    res.status(500).json({ error: "Failed to get user preferences" });
  }
});

/**
 * @brief Update user preferences.
 * @route PUT /api/users/preferences
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
router.put("/preferences", async (req, res) => {
  const {
    userId,
    auth0Id,
    sessionLengthMinutes,
    challengeDifficulty,
    preferredChallengeTypes,
  } = req.body;

  const identifier = auth0Id || userId;

  if (!identifier) {
    return res.status(400).json({ error: "Missing userId or auth0Id" });
  }

  const normalizedPreferredTypes = Array.isArray(preferredChallengeTypes)
    ? `{${preferredChallengeTypes.map((value) => `"${value}"`).join(",")}}`
    : preferredChallengeTypes;

  try {
    const existingUser = await db.query(
      `SELECT id FROM users WHERE auth0_id = $1 OR id::text = $2 LIMIT 1`,
      [identifier, identifier],
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await db.query(
      `
      UPDATE users
      SET
        session_length_minutes = $1,
        challenge_difficulty = $2,
        preferred_challenge_types = $3,
        updated_at = NOW()
      WHERE auth0_id = $4 OR id::text = $5
      RETURNING id, email, display_name, session_length_minutes, challenge_difficulty, preferred_challenge_types, xp, challenges_completed, current_streak, longest_streak, created_at, updated_at;
    `,
      [
        sessionLengthMinutes,
        challengeDifficulty,
        normalizedPreferredTypes,
        identifier,
        identifier,
      ],
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Failed to update user preferences:", err.message);
    res.status(500).json({ error: "Failed to update user preferences" });
  }
});

module.exports = router;
