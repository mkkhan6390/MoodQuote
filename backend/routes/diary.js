const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');

// POST /api/diary – Create a new diary entry
router.post('/', async (req, res) => {
  try {
    const { userId, mood, subcategoryId, description } = req.body;

    if (!mood || !description) {
      return res.status(400).json({ error: 'mood and description are required.' });
    }

    const entry = new DiaryEntry({
      userId: userId || undefined,
      mood,
      subcategoryId: subcategoryId || undefined,
      description,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating diary entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/diary – List all diary entries (optionally filter by userId)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    const entries = await DiaryEntry.find(filter).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
