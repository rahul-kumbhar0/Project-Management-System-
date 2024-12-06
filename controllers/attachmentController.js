const Attachment = require('../models/attachmentSchema');
const Task = require('../models/taskSchema');
const Bug = require('../models/bugSchema');
const Project = require('../models/projectSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const ActivityLogger = require('../controllers/activityLogger');  // Import ActivityLogger

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Add allowed file types
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX, XLS, and XLSX files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Utility function to validate parent type
const isValidParentType = (parentType) => {
    return ['Task', 'Bug', 'Project'].includes(parentType);
};

// Upload Attachment
exports.uploadAttachment = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const { parentId, parentType } = req.body;

            // Validate input
            if (!parentId || !parentType) {
                // Delete uploaded file if validation fails
                await fs.unlink(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: 'Parent ID and parent type are required',
                });
            }

            if (!isValidParentType(parentType)) {
                await fs.unlink(req.file.path);
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid parent type' 
                });
            }

            // Check if parent exists
            let parent;
            switch (parentType) {
                case 'Task':
                    parent = await Task.findById(parentId);
                    break;
                case 'Bug':
                    parent = await Bug.findById(parentId);
                    break;
                case 'Project':
                    parent = await Project.findById(parentId);
                    break;
            }

            if (!parent) {
                await fs.unlink(req.file.path);
                return res.status(404).json({ 
                    success: false, 
                    message: `${parentType} not found` 
                });
            }

            const attachment = new Attachment({
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                uploadedBy: req.user.id,
                parentType,
                parent: parentId,
            });

            await attachment.save();

            // Log the activity of uploading the attachment
            await ActivityLogger.logActivity(
                'create', 
                `Attachment "${attachment.fileName}" uploaded to ${parentType} with ID ${parentId} by ${req.user.name}`,
                req.user.id
            );

            res.status(201).json({
                success: true,
                message: 'Attachment uploaded successfully',
                attachment,
            });
        } catch (error) {
            // Clean up uploaded file if something goes wrong
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            console.error('Error uploading attachment:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to upload attachment',
                error: error.message,
            });
        }
    }
];

// Get All Attachments
exports.getAllAttachments = async (req, res) => {
    try {
        const attachments = await Attachment.find()
            .populate('uploadedBy', 'name email')
            .populate('parent')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: attachments.length,
            attachments
        });
    } catch (error) {
        console.error('Error fetching attachments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get attachments',
            error: error.message,
        });
    }
};

// Get Attachments for a specific Parent (Task, Bug, Project)
exports.getAttachmentsForParent = async (req, res) => {
    const { parentType, parentId } = req.params;

    if (!isValidParentType(parentType)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid parent type' 
        });
    }

    try {
        const attachments = await Attachment.find({ 
            parent: parentId, 
            parentType 
        })
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true,
            count: attachments.length, 
            attachments 
        });
    } catch (error) {
        console.error('Error fetching attachments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get attachments',
            error: error.message,
        });
    }
};

// Delete Attachment
exports.deleteAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found'
            });
        }

        // Delete the file from storage
        await fs.unlink(attachment.filePath);

        // Delete the database record
        await attachment.deleteOne();

        // Log the activity of deleting the attachment
        await ActivityLogger.logActivity(
            'delete', 
            `Attachment "${attachment.fileName}" deleted by ${req.user.name}`,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: 'Attachment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete attachment',
            error: error.message
        });
    }
};
