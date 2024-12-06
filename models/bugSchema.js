const mongoose = require('mongoose');

// Define the bug schema
const bugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,  // Optional: Ensure description is detailed
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Optional: Make it required if bugs must have an assignee
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
}, {
    timestamps: true,
});

// Create an index for faster searching
bugSchema.index({ title: 1, project: 1 });

module.exports = mongoose.model('Bug', bugSchema);
