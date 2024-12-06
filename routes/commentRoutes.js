const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.use(authenticateJWT);

// Route to create a new comment
router.post('/', commentController.createComment);

// Route to get comments for a specific parent (Task, Bug, or Project)
router.get('/:parentType/:parentId', commentController.getCommentsForParent);

module.exports = router;
