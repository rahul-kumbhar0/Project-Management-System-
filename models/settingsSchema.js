// models/settingsSchema.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    preferences: {
        notifications: { type: Boolean, default: true },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        language: { type: String, default: 'en' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
