const express = require('express');
const router = express.Router();

// Challenge pool for MVP.
// Later, this can be moved into the Neon database.
const challenges = [
  {
    id: 1,
    title: 'Quick Neck Reset',
    description: 'Slowly roll your shoulders back 5 times, then gently tilt your head left and right.',
    category: 'stretch',
    difficulty: 'easy',
    durationMinutes: 1,
  },
  {
    id: 2,
    title: 'Stand and Reach',
    description: 'Stand up, reach both arms overhead, and hold the stretch for 30 seconds.',
    category: 'stretch',
    difficulty: 'easy',
    durationMinutes: 1,
  },
  {
    id: 3,
    title: 'Desk Stretch Combo',
    description: 'Stretch your wrists, shoulders, and back for two minutes before sitting down again.',
    category: 'stretch',
    difficulty: 'medium',
    durationMinutes: 2,
  },
  {
    id: 4,
    title: 'Room Walk',
    description: 'Walk around your room or workspace for two minutes.',
    category: 'exercise',
    difficulty: 'easy',
    durationMinutes: 2,
  },
  {
    id: 5,
    title: 'Mini Cardio',
    description: 'Do 15 jumping jacks or march in place for one minute.',
    category: 'exercise',
    difficulty: 'medium',
    durationMinutes: 2,
  },
  {
    id: 6,
    title: 'Power Break',
    description: 'Do 10 squats, 10 wall pushups, and a 30 second walk.',
    category: 'exercise',
    difficulty: 'hard',
    durationMinutes: 5,
  },
  {
    id: 7,
    title: 'Window Reset',
    description: 'Look outside or across the room for 20 seconds to rest your eyes.',
    category: 'outside',
    difficulty: 'easy',
    durationMinutes: 1,
  },
  {
    id: 8,
    title: 'Fresh Air Check',
    description: 'Step outside or near a window and take 10 slow breaths.',
    category: 'outside',
    difficulty: 'medium',
    durationMinutes: 3,
  },
  {
    id: 9,
    title: 'Color Hunt',
    description: 'Find three blue objects near you before returning to work.',
    category: 'hunt',
    difficulty: 'easy',
    durationMinutes: 1,
  },
  {
    id: 10,
    title: 'Texture Hunt',
    description: 'Find one smooth object, one rough object, and one soft object.',
    category: 'hunt',
    difficulty: 'medium',
    durationMinutes: 3,
  },
  {
    id: 11,
    title: 'Three Word Reset',
    description: 'Write down three words that describe how you feel right now.',
    category: 'brain',
    difficulty: 'easy',
    durationMinutes: 1,
  },
  {
    id: 12,
    title: 'Quick Puzzle',
    description: 'Count backward from 50 by 3s without using a calculator.',
    category: 'brain',
    difficulty: 'medium',
    durationMinutes: 2,
  },
];

const validDifficulties = ['easy', 'medium', 'hard'];
const validCategories = ['hunt', 'brain', 'outside', 'exercise', 'stretch'];

const pickRandom = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

// GET /api/challenges/test
router.get('/test', (req, res) => {
  res.json({ message: 'Challenges route is working!' });
});

// GET /api/challenges
router.get('/', (req, res) => {
  res.json(challenges);
});

// GET /api/challenges/random?difficulty=medium&categories=stretch,brain
router.get('/random', (req, res) => {
  const difficulty = validDifficulties.includes(req.query.difficulty)
    ? req.query.difficulty
    : 'medium';

  const selectedCategories = req.query.categories
    ? req.query.categories
        .split(',')
        .map((category) => category.trim())
        .filter((category) => validCategories.includes(category))
    : [];

  const matchingChallenges = challenges.filter((challenge) => {
    const difficultyMatches = challenge.difficulty === difficulty;
    const categoryMatches =
      selectedCategories.length === 0 ||
      selectedCategories.includes(challenge.category);

    return difficultyMatches && categoryMatches;
  });

  if (matchingChallenges.length === 0) {
    return res.status(404).json({
      message: 'No challenge matched the selected difficulty and categories.',
    });
  }

  res.json(pickRandom(matchingChallenges));
});

module.exports = router;