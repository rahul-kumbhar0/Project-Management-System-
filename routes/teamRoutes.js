// teamRoutes.js

const express = require('express');
const {
    createTeam,
    getAllTeams,
    deleteTeam,
} = require('../controllers/teamController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new team
router.post('/', authenticateJWT, createTeam);

// Get all teams
router.get('/', authenticateJWT, getAllTeams);

// Delete a team by ID
router.delete('/:teamId', authenticateJWT, deleteTeam);

module.exports = router;
