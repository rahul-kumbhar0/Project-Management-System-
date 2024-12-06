const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/sprintController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Route to create a new sprint
router.post('/', authorizeRoles(['admin', 'project_manager']), sprintController.createSprint);

// Route to get all sprints
router.get('/', authorizeRoles(['admin', 'project_manager', 'developer', 'scrum_master']), sprintController.getAllSprints);

// Route to get a single sprint by ID
router.get('/:id', authorizeRoles(['admin', 'project_manager', 'developer', 'scrum_master']), sprintController.getSprintById);

// Route to update a sprint by ID
router.put('/:id', authorizeRoles(['admin', 'project_manager']), sprintController.updateSprint);

// Route to delete a sprint by ID
router.delete('/:id', authorizeRoles(['admin', 'project_manager']), sprintController.deleteSprint);

module.exports = router;
