const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateJWT);

// Route to create a new note
router.post('/', authorizeRoles(['admin', 'project_manager', 'scrum_master', 'developer']), noteController.createNote);

// Route to get all notes
router.get('/', authorizeRoles(['admin', 'project_manager', 'scrum_master', 'developer']), noteController.getAllNotes);

// Route to get a note by ID
router.get('/:id', authorizeRoles(['admin', 'project_manager', 'scrum_master', 'developer']), noteController.getNoteById);

// Route to update a note by ID
router.put('/:id', authorizeRoles(['admin', 'project_manager', 'scrum_master', 'developer']), noteController.updateNote);

// Route to delete a note by ID
router.delete('/:id', authorizeRoles(['admin', 'project_manager', 'scrum_master']), noteController.deleteNote);

module.exports = router;
