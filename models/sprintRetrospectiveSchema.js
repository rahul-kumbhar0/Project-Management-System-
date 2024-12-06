const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sprintRetrospectiveSchema = new Schema({
  sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', required: true },
  feedback: { type: String, required: true },
  actionItems: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Create an index for faster searching
sprintRetrospectiveSchema.index({ sprintId: 1 });

module.exports = mongoose.model('SprintRetrospective', sprintRetrospectiveSchema);
