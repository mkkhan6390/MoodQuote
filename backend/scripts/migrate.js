const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Subcategory = require('../models/Subcategory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodquote';
const QUOTES_JSON_PATH = path.join(__dirname, '../../src/data/quotes.json');

async function runMigration() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    console.log(`Reading quotes data from ${QUOTES_JSON_PATH}...`);
    if (!fs.existsSync(QUOTES_JSON_PATH)) {
      throw new Error(`File not found: ${QUOTES_JSON_PATH}`);
    }

    const rawData = fs.readFileSync(QUOTES_JSON_PATH, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.categories || !Array.isArray(data.categories)) {
      throw new Error('Invalid JSON format: missing or invalid categories array.');
    }

    console.log(`Found ${data.categories.length} categories. Starting migration...`);

    let migratedCount = 0;

    for (const category of data.categories) {
      if (!category.subcategories || !Array.isArray(category.subcategories)) {
        console.log(`Category "${category.name}" has no subcategories. Skipping.`);
        continue;
      }

      for (const subcategory of category.subcategories) {
        console.log(`Migrating subcategory: ${category.name} -> ${subcategory.name}...`);

        const subcategoryDoc = {
          subcategoryId: subcategory.id,
          subcategoryName: subcategory.name,
          categoryId: category.id,
          categoryName: category.name,
          categoryAccent: category.accent || '#4F46E5',
          categoryIcon: category.icon || 'book-outline',
          quotes: subcategory.quotes || {}
        };

        await Subcategory.findOneAndUpdate(
          { subcategoryId: subcategory.id },
          subcategoryDoc,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        migratedCount++;
      }
    }

    console.log(`Migration completed successfully! Migrated ${migratedCount} subcategories.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

runMigration();
