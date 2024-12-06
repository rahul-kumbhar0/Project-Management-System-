const express = require('express');
const router = express.Router();
const capacityController = require('../controllers/capacityController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');


router.use(authenticateJWT);

// Route to create or update capacity
router.post('/', authorizeRoles(['admin', 'project_manager']), capacityController.updateCapacity);

// Route to get all capacities
router.get('/', authorizeRoles(['admin', 'project_manager', 'scrum_master']), capacityController.getAllCapacities);

// Route to get capacity by user ID
router.get('/user/:userId', authorizeRoles(['admin', 'project_manager']), capacityController.getCapacityByUser);

// Route to delete capacity by ID
router.delete('/:id', authorizeRoles(['admin']), capacityController.deleteCapacity);

module.exports = router;
