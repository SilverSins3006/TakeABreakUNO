/**
 * @file Challenges route module. Provides endpoints for creating challenges,
 * fetching a single random challenge, and listing all challenges, with
 * optional difficulty and category filters.
 */
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const difficultyMap = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/**
 * Maps category aliases (lowercase, spaced, or hyphenated) to the
 * normalized category names actually stored in the database.
 * @type {Object<string,string>}
 */
const categoryMap = {
  exercise: "Exercise",
  stretch: "Stretch",
  chores: "Chores",
  brain: "Brain Teaser",
  "brain teaser": "Brain Teaser",
  "brain-teaser": "Brain Teaser",
  hunt: "Scavenger Hunt",
  "scavenger hunt": "Scavenger Hunt",
  "scavenger-hunt": "Scavenger Hunt",
  outside: "Get Outside",
  "get outside": "Get Outside",
  "get-outside": "Get Outside",
};

const durationMap = {
  Easy: 10,
  Medium: 20,
  Hard: 30,
};

const xpMap = {
  Easy: 10,
  Medium: 20,
  Hard: 30,
};

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

/**
 * Normalizes a difficulty string to one of "Easy", "Medium", or "Hard".
 * Case-insensitive, trims whitespace. Returns null if it doesn't match.
 * @param {string} difficulty - Raw difficulty value from the request.
 * @returns {string|null} The normalized difficulty, or null if invalid.
 */
const normalizeDifficulty = (difficulty) => {
  if (typeof difficulty !== "string") {
    return null;
  }
  return difficultyMap[difficulty.trim().toLowerCase()] || null;
};

/**
 * Normalizes a category string using categoryMap, so aliases like
 * "brain-teaser" and "Brain Teaser" both resolve to the same value.
 * @param {string} category - Raw category value from the request.
 * @returns {string|null} The normalized category, or null if invalid.
 */
const normalizeCategory = (category) => {
  if (typeof category !== "string") {
    return null;
  }
  return categoryMap[category.trim().toLowerCase()] || null;
};

/**
 * Pulls a user identifier off the request, checking Auth0's payload first,
 * then falling back to whatever the request body provided. Used since some
 * routes are hit before full Auth0 middleware context is available.
 * @param {Object} req - Express request.
 * @returns {string|null} The user identifier, or null if none was found.
 */
const getUserIdentifier = (req) => {
  return (
    req.auth?.payload?.sub ||
    req.user?.sub ||
    req.body?.auth0Id ||
    req.body?.userId ||
    null
  );
};

/**
 * Creates a new challenge. Validates title, description, difficulty, and
 * category, looks up the internal user ID from the Auth0 identifier, then
 * inserts the challenge.
 * @route POST /api/challenges
 * @param {Object} req - Expects title, description, difficulty, and category (or type) in the body.
 * @param {Object} res - Sends the created challenge, or a 400/404/500 on failure.
 * @returns {Promise<void>}
 */
router.post("/", async (req, res) => {
  const userIdentifier = getUserIdentifier(req);

  const title =
    typeof req.body?.title === "string" ? req.body.title.trim() : "";

  const description =
    typeof req.body?.description === "string"
      ? req.body.description.trim()
      : "";

  const difficulty = normalizeDifficulty(req.body?.difficulty);

  // Accept category normally.
  // Also accept type because the current React page calls it type.
  const category = normalizeCategory(req.body?.category || req.body?.type);

  const durationMinutes = durationMap[difficulty]?.toString() || "30";

  const xpReward = xpMap[difficulty]?.toString() || "30";

  const validationErrors = {};

  if (!userIdentifier) {
    validationErrors.user = "A logged-in user ID is required.";
  }

  if (!title) {
    validationErrors.title = "Title is required.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    validationErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!description) {
    validationErrors.description = "Description is required.";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    validationErrors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  if (!difficulty) {
    validationErrors.difficulty = "Difficulty must be Easy, Medium, or Hard.";
  }

  if (!category) {
    validationErrors.category = "Please select a valid category.";
  }

  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({
      error: "Invalid challenge input.",
      fields: validationErrors,
    });
  }

  try {
    // Find the application's user row using the Auth0 ID.
    const userResult = await db.query(
      `
        SELECT id
        FROM users
        WHERE auth0_id = $1
           OR id::text = $2
        LIMIT 1;
      `,
      [userIdentifier, String(userIdentifier)],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "User not found. Sync the user first.",
      });
    }

    const databaseUserId = userResult.rows[0].id;

    // Save the new challenge.
    const result = await db.query(
      `
        INSERT INTO challenges (
          title,
          description,
          category,
          difficulty,
          duration_minutes,
          xp_reward
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          title,
          description,
          category,
          difficulty,
          duration_minutes,
          xp_reward
      `,
      [title, description, category, difficulty, durationMinutes, xpReward],
    );

    return res.status(201).json({
      challenge: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create challenge:", error.message);

    return res.status(500).json({
      error: "Failed to create challenge",
    });
  }
});

/**
 * Gets a single random challenge, optionally filtered by difficulty and/or
 * category. Sets no-cache headers so Vercel's edge network and the browser
 * don't serve a stale result.
 * @route GET /api/challenges/random
 * @param {Object} req - Optional difficulty and category in the query string.
 * @param {Object} res - Sends the random challenge, a 404 if none match, or a 500 on failure.
 * @returns {Promise<void>}
 */
router.get("/random", async (req, res) => {
  try {
    // Force the browser and Vercel edge network to skip caching this request
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const { difficulty, category } = req.query;

    let query = "SELECT * FROM challenges";
    const conditions = [];
    const values = [];

    if (difficulty) {
      values.push(difficulty);
      conditions.push(`LOWER(difficulty) = LOWER($${values.length})`);
    }

    if (category) {
      const mappedCategory = categoryMap[category.toLowerCase()] || category;
      values.push(mappedCategory);
      conditions.push(`LOWER(category) = LOWER($${values.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY RANDOM() LIMIT 1";

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No matching challenge found.",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to get random challenge:", err.message);
    res.status(500).json({ error: "Failed to get random challenge" });
  }
});

/**
 * Lists all challenges, optionally filtered by difficulty and/or category,
 * ordered by id.
 * @route GET /api/challenges
 * @param {Object} req - Optional difficulty and category in the query string.
 * @param {Object} res - Sends an array of matching challenges, or a 500 on failure.
 * @returns {Promise<void>}
 */
router.get("/", async (req, res) => {
  try {
    const { difficulty, category } = req.query;

    let query = "SELECT * FROM challenges";
    const conditions = [];
    const values = [];

    if (difficulty) {
      values.push(difficulty);
      conditions.push(`LOWER(difficulty) = LOWER($${values.length})`);
    }

    if (category) {
      const mappedCategory = categoryMap[category.toLowerCase()] || category;
      values.push(mappedCategory);
      conditions.push(`LOWER(category) = LOWER($${values.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY id";

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to get challenges:", err.message);
    res.status(500).json({ error: "Failed to get challenges" });
  }
});

module.exports = router;