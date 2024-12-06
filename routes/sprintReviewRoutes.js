const express = require('express');
const router = express.Router();
const sprintReviewController = require('../controllers/sprintReviewController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Middleware to authenticate user
router.use(authenticateJWT);

// Route to create a new Sprint Review
// Accessible by Project Managers and Admins
router.post('/', authorizeRoles(['project_manager', 'admin']), sprintReviewController.createSprintReview);

// Route to get all Sprint Reviews
// Accessible by any authenticated user
router.get('/', sprintReviewController.getAllSprintReviews);

// Route to get a single Sprint Review by ID
// Accessible by any authenticated user
router.get('/:id', sprintReviewController.getSprintReviewById);

// Route to update a Sprint Review
// Accessible by Project Managers and Admins
router.put('/:id', authorizeRoles(['project_manager', 'admin']), sprintReviewController.updateSprintReview);

// Route to delete a Sprint Review by ID
// Accessible by Project Managers and Admins
router.delete('/:id', authorizeRoles(['project_manager', 'admin']), sprintReviewController.deleteSprintReview);

module.exports = router;
