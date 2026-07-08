const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Subcategory = require('./models/Subcategory');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodquote';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// GET /api/categories - Reconstruct categories list with minimal subcategory info for PickerPage
app.use('/api/categories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}, 'subcategoryId subcategoryName categoryId categoryName categoryAccent categoryIcon');

    // Group subcategories by category
    const categoriesMap = {};

    subcategories.forEach(sub => {
      if (!categoriesMap[sub.categoryId]) {
        categoriesMap[sub.categoryId] = {
          id: sub.categoryId,
          name: sub.categoryName,
          accent: sub.categoryAccent,
          icon: sub.categoryIcon,
          subcategories: []
        };
      }
      categoriesMap[sub.categoryId].subcategories.push({
        id: sub.subcategoryId,
        name: sub.subcategoryName
      });
    });

    const categories = Object.values(categoriesMap);
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/subcategories/:subcategoryId - Fetch full subcategory with its quotes
app.get('/api/subcategories/:subcategoryId', async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const subcategory = await Subcategory.findOne({ subcategoryId });

    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.json(subcategory);
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
