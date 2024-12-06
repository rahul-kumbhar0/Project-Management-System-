// labelRoutes.js

const express = require('express');
const {
    createLabel,
    getAllLabels,
    deleteLabel,
} = require('../controllers/labelController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new label
router.post('/', authenticateJWT,authorizeRoles(['admin', 'project manager', 'developer', 'scrum_master' ]), createLabel);

// Get all labels
router.get('/', authenticateJWT, authorizeRoles(['admin', 'project manager', 'developer', 'scrum_master' ]), getAllLabels);

// Delete a label by ID
router.delete('/:labelId', authenticateJWT,authorizeRoles(['admin', 'project manager', 'developer', 'scrum_master' ]), deleteLabel);

module.exports = router;
