const mongoose = require('mongoose');

const DiaryEntrySchema = new mongoose.Schema({
  userId: { type: String, required: false }, // optional for future auth
  mood: { type: String, required: true },
  subcategoryId: { type: String, required: false },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);
