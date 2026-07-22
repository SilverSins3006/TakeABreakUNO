/**
 * @file Challenges route module.
 * @brief Provides endpoints for retrieving challenge data and category normalization.
 */
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const difficultyMap = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/**
 * @brief Maps category aliases to normalized challenge categories.
 * @type {Object<string,string>}
 */
const categoryMap = {
  exercise: 'Exercise',
  stretch: 'Stretch',
  chores: 'Chores',
  brain: 'Brain Teaser',
  'brain teaser': 'Brain Teaser',
  'brain-teaser': 'Brain Teaser',
  hunt: 'Scavenger Hunt',
  'scavenger hunt': 'Scavenger Hunt',
  'scavenger-hunt': 'Scavenger Hunt',
  outside: 'Get Outside',
  'get outside': 'Get Outside',
  'get-outside': 'Get Outside',
};

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;
const normalizeDifficulty = (difficulty) => {
  if (typeof difficulty !== 'string') {
    return null;
  }
  return difficultyMap[difficulty.trim().toLowerCase()] || null;
};

const normalizeCategory = (category) => {
  if (typeof category !== 'string') {
    return null;
  }
  return categoryMap[category.trim().toLowerCase()] || null;
};

const getUserIdentifier = (req) => {
  return (
    req.auth?.payload?.sub ||
    req.user?.sub ||
    req.body?.auth0Id ||
    req.body?.userId ||
    null
  );
};

router.post("/", async (req, res) => {
  const userIdentifier = getUserIdentifier(req);

  const title =
    typeof req.body?.title === "string"
      ? req.body.title.trim()
      : "";

  const description =
    typeof req.body?.description === "string"
      ? req.body.description.trim()
      : "";

  const difficulty = normalizeDifficulty(req.body?.difficulty);

  // Accept category normally.
  // Also accept type because the current React page calls it type.
  const category = normalizeCategory(
    req.body?.category || req.body?.type
  );

  const validationErrors = {};

  if (!userIdentifier) {
    validationErrors.user = "A logged-in user ID is required.";
  }

  if (!title) {
    validationErrors.title = "Title is required.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    validationErrors.title =
      `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!description) {
    validationErrors.description = "Description is required.";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    validationErrors.description =
      `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  if (!difficulty) {
    validationErrors.difficulty =
      "Difficulty must be Easy, Medium, or Hard.";
  }

  if (!category) {
    validationErrors.category =
      "Please select a valid category.";
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
      [userIdentifier, String(userIdentifier)]
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
          difficulty,
          category,
          created_by_user_id,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING
          id,
          title,
          description,
          difficulty,
          category,
          created_by_user_id,
          created_at,
          updated_at;
      `,
      [
        title,
        description,
        difficulty,
        category,
        databaseUserId,
      ]
    );

    return res.status(201).json({
      challenge: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Failed to create challenge:",
      error.message
    );

    return res.status(500).json({
      error: "Failed to create challenge",
    });
  }
});

/**
 * @brief Get a single random challenge.
 * @route GET /api/challenges/random
 * @param {Object} req Express request object.
 * @param {string} [req.query.difficulty] Optional difficulty filter.
 * @param {string} [req.query.category] Optional category filter.
 * @param {Object} res Express response object.
 */
router.get('/random', async (req, res) => {
  try {
    // Force the browser and Vercel edge network to skip caching this request
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { difficulty, category } = req.query;

    let query = 'SELECT * FROM challenges';
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
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No matching challenge found.',
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to get random challenge:', err.message);
    res.status(500).json({ error: 'Failed to get random challenge' });
  }
});

/**
 * @brief Get all challenges, optionally filtered by difficulty or category.
 * @route GET /api/challenges
 * @param {Object} req Express request object.
 * @param {string} [req.query.difficulty] Optional difficulty filter.
 * @param {string} [req.query.category] Optional category filter.
 * @param {Object} res Express response object.
 */
router.get('/', async (req, res) => {
  try {
    const { difficulty, category } = req.query;

    let query = 'SELECT * FROM challenges';
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
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY id';

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to get challenges:', err.message);
    res.status(500).json({ error: 'Failed to get challenges' });
  }
});

module.exports = router;