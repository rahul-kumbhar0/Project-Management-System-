const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Upload attachment
router.post('/', 
    authorizeRoles(['admin', 'developer']), 
    attachmentController.uploadAttachment
);

// Get all attachments
router.get('/', 
    authorizeRoles(['admin', 'project_manager', 'developer']), 
    attachmentController.getAllAttachments
);

// Get attachments for specific parent (task/bug/project)
router.get('/:parentType/:parentId', 
    authorizeRoles(['admin', 'project_manager', 'developer']), 
    attachmentController.getAttachmentsForParent
);

// Delete attachment
router.delete('/:id', 
    authorizeRoles(['admin']), 
    attachmentController.deleteAttachment
);

module.exports = router;