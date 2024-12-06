// routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Apply JWT authentication to all routes in this router
router.use(authenticateJWT);

// Route to search across tasks, bugs, and projects
router.get('/', searchController.search);

module.exports = router;
