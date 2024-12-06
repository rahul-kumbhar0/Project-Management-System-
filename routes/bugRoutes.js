const express = require('express');
const router = express.Router();
const {
    createBug,
    getBugsByProject,
    updateBug,
    deleteBug,
} = require('../controllers/bugController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Define routes for bugs
router.post('/:projectId', authenticateJWT, authorizeRoles(['admin', 'project manager', 'developer']), createBug);
router.get('/:projectId', authenticateJWT, getBugsByProject);
router.put('/:id', authenticateJWT, authorizeRoles(['admin', 'project manager']), updateBug);
router.delete('/:id', authenticateJWT, authorizeRoles(['admin']), deleteBug);

module.exports = router;
