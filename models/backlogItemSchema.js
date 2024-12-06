const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const backlogItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Create an index for faster searching
backlogItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('BacklogItem', backlogItemSchema);
