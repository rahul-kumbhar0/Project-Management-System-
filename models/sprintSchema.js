const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sprintSchema = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  goal: { type: String },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
}, { timestamps: true });

// Create an index for faster searching
sprintSchema.index({ title: 'text', goal: 'text' });

module.exports = mongoose.model('Sprint', sprintSchema);
