const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentType: { type: String, enum: ['Task', 'Bug', 'Project'], required: true },
  parent: { type: Schema.Types.ObjectId, refPath: 'parentType', required: true },
}, { timestamps: true });

// Create an index for faster searching
commentSchema.index({ content: 1 });

module.exports = mongoose.model('Comment', commentSchema);
