const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Middleware for authentication
router.use(authenticateJWT);

// Route to create a new task
router.post('/', authorizeRoles(['admin', 'project manager']), taskController.createTask);

// Route to get all tasks
router.get('/', taskController.getTasks);

// Route to update a task
router.put('/:taskId', authorizeRoles(['admin', 'project manager']), taskController.updateTask);

// Route to delete a task
router.delete('/:taskId', authorizeRoles(['admin', 'project manager']), taskController.deleteTask);

module.exports = router;
