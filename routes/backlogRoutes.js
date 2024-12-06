const express = require('express');
const router = express.Router();
const backlogController = require('../controllers/backlogController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Route to create a new backlog item
router.post('/', authorizeRoles(['admin', 'project_manager']), backlogController.createBacklogItem);

// Route to get all backlog items
router.get('/', authorizeRoles(['admin', 'project_manager', 'developer', 'scrum_master']), backlogController.getAllBacklogItems);

// Route to get a single backlog item by ID
router.get('/:id', authorizeRoles(['admin', 'project_manager', 'developer', 'scrum_master']), backlogController.getBacklogItemById);

// Route to update a backlog item by ID
router.put('/:id', authorizeRoles(['admin', 'project_manager']), backlogController.updateBacklogItem);

// Route to delete a backlog item by ID
router.delete('/:id', authorizeRoles(['admin', 'project_manager']), backlogController.deleteBacklogItem);

module.exports = router;
