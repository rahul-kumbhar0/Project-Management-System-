const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Draft' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
