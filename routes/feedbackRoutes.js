// routes/feedbackRoutes.js
const express = require('express');
const { createFeedback, getFeedbackByProject, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create feedback
router.post('/', authenticateJWT, authorizeRoles(['developer', 'project manager', 'client']), createFeedback);

// Route to get feedback by project
router.get('/:projectId', authenticateJWT, getFeedbackByProject);

// Route to update feedback
router.put('/:id', authenticateJWT, authorizeRoles(['developer', 'project manager']), updateFeedback);

// Route to delete feedback
router.delete('/:id', authenticateJWT, authorizeRoles(['admin', 'project manager']), deleteFeedback);

module.exports = router;
