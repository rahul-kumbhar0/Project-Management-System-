const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyScrumSchema = new Schema({
  date: { type: Date, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  updates: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    update: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Create an index for faster searching
dailyScrumSchema.index({ date: 1 });

module.exports = mongoose.model('DailyScrum', dailyScrumSchema);
