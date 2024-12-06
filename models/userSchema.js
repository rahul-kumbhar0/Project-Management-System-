// userSchema.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'project_manager', 'developer', 'scrum_master', 'client'],
        default: 'client',
    },
    permissions: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add additional methods, virtuals, or pre-save hooks if needed
userSchema.pre('save', async function (next) {
    // Example: Hash password before saving
    // if (this.isModified('password')) {
    //     this.password = await bcrypt.hash(this.password, 10);
    // }
    next();
});

// Create an index for faster searching
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
