const express = require('express');
const router = express.Router();
const sprintReviewController = require('../controllers/sprintReviewController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Middleware to authenticate user
router.use(authenticateJWT);

// Accessible by Project Managers and Admins
router.post('/', authorizeRoles(['project_manager', 'admin']), sprintReviewController.createSprintReview);

// Accessible by any authenticated user
router.get('/', sprintReviewController.getAllSprintReviews);

// Accessible by any authenticated user
router.get('/:id', sprintReviewController.getSprintReviewById);

// Accessible by Project Managers and Admins
router.put('/:id', authorizeRoles(['project_manager', 'admin']), sprintReviewController.updateSprintReview);

// Accessible by Project Managers and Admins
router.delete('/:id', authorizeRoles(['project_manager', 'admin']), sprintReviewController.deleteSprintReview);

module.exports = router;
