const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateJWT);

// Route to create a new report
router.post('/', authorizeRoles(['admin', 'project_manager', 'scrum_master']), reportController.createReport);

// Route to get all reports
router.get('/', authorizeRoles(['admin', 'project_manager', 'scrum_master', 'developer']), reportController.getAllReports);

// Route to get a report by ID
router.get('/:id', authorizeRoles(['admin', 'project_manager', 'scrum_master', 'developer']), reportController.getReportById);

// Route to update a report by ID
router.put('/:id', authorizeRoles(['admin', 'project_manager', 'scrum_master']), reportController.updateReport);

// Route to delete a report by ID
router.delete('/:id', authorizeRoles(['admin', 'project_manager']), reportController.deleteReport);

module.exports = router;
