const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sprintReviewSchema = new Schema({
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', required: true },
    feedback: { type: String, required: true },
    demoLink: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Create an index for faster searching
sprintReviewSchema.index({ sprintId: 1 });

module.exports = mongoose.model('SprintReview', sprintReviewSchema);
