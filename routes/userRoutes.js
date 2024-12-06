const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authMiddleware'); // Role-based access control

// Middleware to authenticate JWT
router.use(authenticateJWT);

// Route to get all users (accessible by admin)
router.get('/', authorizeRoles(['admin']), userController.getAllUsers);

// Route to get a user by ID (accessible by admin or the user themselves)
router.get('/:id', authenticateJWT, userController.getUserById); // Consider adding role authorization

// Route to update user role (accessible by admin)
router.put('/role', authorizeRoles(['admin']), userController.updateUserRole);

// Route to delete a user (accessible by admin)
router.delete('/:userId', authorizeRoles(['admin']), userController.deleteUser);

module.exports = router;
