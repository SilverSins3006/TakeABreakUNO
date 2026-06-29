const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/challenges/test
router.get('/test', (req, res) => {
  res.json({ message: 'Challenges route is working!' });
});

// Maps frontend category values to database category names
const categoryMap = {
  exercise: 'Exercise',
  stretch: 'Stretch',
  chores: 'Chores',
  brain: 'Brain Teaser',
  'brain-teaser': 'Brain Teaser',
  hunt: 'Scavenger Hunt',
  'scavenger-hunt': 'Scavenger Hunt',
  outside: 'Get Outside',
  'get-outside': 'Get Outside',
};

// GET /api/challenges
// Examples:
// /api/challenges
// /api/challenges?difficulty=Easy
// /api/challenges?category=Exercise
// /api/challenges?difficulty=Easy&category=Exercise
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

// GET /api/challenges/random
// Examples:
// /api/challenges/random
// /api/challenges/random?difficulty=Easy
// /api/challenges/random?category=Exercise
// /api/challenges/random?difficulty=Easy&category=Exercise
router.get('/random', async (req, res) => {
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

module.exports = router;