const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Route to create a new project
router.post('/', authorizeRoles(['admin', 'project_manager']), projectController.createProject);

// Route to get all projects
router.get('/', authorizeRoles(['admin', 'project_manager', 'developer', 'scrum_master']), projectController.getAllProjects);

// Route to get a single project by ID
router.get('/:id', projectController.getProjectById);

// Route to update a project by ID
router.put('/:id', authorizeRoles(['admin', 'project_manager']), projectController.updateProject);

// Route to delete a project by ID
router.delete('/:id', authorizeRoles(['admin', 'project_manager']), projectController.deleteProject);

module.exports = router;


