const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
    fileName: { 
        type: String, 
        required: true,
        trim: true
    },
    filePath: { 
        type: String, 
        required: true,
        trim: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    uploadedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    parentType: { 
        type: String, 
        enum: ['Task', 'Bug', 'Project'], 
        required: true 
    },
    parent: { 
        type: Schema.Types.ObjectId, 
        refPath: 'parentType', 
        required: true 
    },
}, { 
    timestamps: true 
});

// Create indexes for faster searching
attachmentSchema.index({ parent: 1, parentType: 1 });
attachmentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Attachment', attachmentSchema);