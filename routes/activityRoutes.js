// activityRoutes.js

const express = require('express');
const { logActivity, getUserActivities } = require('../controllers/activityLogger');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Log a new activity
router.post('/log', authenticateJWT, logActivity);

// Get activity logs for the authenticated user
router.get('/user-logs', authenticateJWT, getUserActivities);

module.exports = router;
