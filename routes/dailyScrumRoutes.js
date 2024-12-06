const express = require('express');
const router = express.Router();
const dailyScrumController = require('../controllers/dailyScrumController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Middleware to authenticate user
router.use(authenticateJWT);

// Route to create a new Daily Scrum
// Accessible by Project Managers, Admins, and Scrum Masters
router.post('/', authorizeRoles(['project_manager', 'admin', 'scrum_master']), dailyScrumController.createDailyScrum);

// Route to get all Daily Scrums
// Accessible by any authenticated user
router.get('/', dailyScrumController.getAllDailyScrums);

// Route to get a single Daily Scrum by ID
// Accessible by any authenticated user
router.get('/:id', dailyScrumController.getDailyScrumById);

// Route to add an update to a Daily Scrum
// Accessible by Project Managers, Admins, Scrum Masters, and participants
router.put('/:id/updates', authorizeRoles(['project_manager', 'admin', 'scrum_master', 'participant']), dailyScrumController.addUpdateToDailyScrum);

// Route to delete a Daily Scrum by ID
// Accessible by Project Managers and Admins
router.delete('/:id', authorizeRoles(['project_manager', 'admin']), dailyScrumController.deleteDailyScrum);

module.exports = router;
