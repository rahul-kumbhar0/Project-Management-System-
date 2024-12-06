const express = require('express');
const router = express.Router();
const sprintRetrospectiveController = require('../controllers/sprintRetrospectiveController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Middleware to authenticate user
router.use(authenticateJWT);

// Route to create a new Sprint Retrospective
// Accessible by Project Managers, Admins, and Scrum Masters
router.post('/', authorizeRoles(['project_manager', 'admin', 'scrum_master']), sprintRetrospectiveController.createSprintRetrospective);

// Route to get all Sprint Retrospectives
// Accessible by any authenticated user
router.get('/', sprintRetrospectiveController.getAllSprintRetrospectives);

// Route to get a single Sprint Retrospective by ID
// Accessible by any authenticated user
router.get('/:id', sprintRetrospectiveController.getSprintRetrospectiveById);

// Route to update a Sprint Retrospective
// Accessible by Project Managers, Admins, and Scrum Masters
router.put('/:id', authorizeRoles(['project_manager', 'admin', 'scrum_master']), sprintRetrospectiveController.updateSprintRetrospective);

// Route to delete a Sprint Retrospective by ID
// Accessible by Project Managers and Admins
router.delete('/:id', authorizeRoles(['project_manager', 'admin']), sprintRetrospectiveController.deleteSprintRetrospective);

module.exports = router;
