const Note = require('../models/noteSchema');
const ActivityLogger = require('./activityLogger'); // Import ActivityLogger

// Create Note
exports.createNote = async (req, res) => {
    const { title, content, project } = req.body;

    if (!title || !content || !project) {
        return res.status(400).json({ message: 'Title, content, and project are required', success: false });
    }

    const newNote = new Note({
        title,
        content,
        createdBy: req.user.id,
        project,
    });

    try {
        await newNote.save();

        // Log activity after creating the note
        await ActivityLogger.logActivity('create_note', `Note created by ${req.user.name}`, req.user.id);

        res.status(201).json({ message: 'Note created successfully', note: newNote, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create note', error: error.message, success: false });
    }
};

// Get All Notes
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().populate('createdBy', 'name').populate('project', 'name');
        
        // Log activity after fetching all notes
        await ActivityLogger.logActivity('get_all_notes', `All notes fetched by ${req.user.name}`, req.user.id);

        res.status(200).json({ notes, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notes', error: error.message, success: false });
    }
};

// Get Note by ID
exports.getNoteById = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Note.findById(id).populate('createdBy', 'name').populate('project', 'name');
        if (!note) {
            return res.status(404).json({ message: 'Note not found', success: false });
        }

        // Log activity after retrieving the note by ID
        await ActivityLogger.logActivity('get_note_by_id', `Note with ID ${id} fetched by ${req.user.name}`, req.user.id);

        res.status(200).json({ note, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve note', error: error.message, success: false });
    }
};

// Update Note
exports.updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found', success: false });
        }

        // Log activity after updating the note
        await ActivityLogger.logActivity('update_note', `Note with ID ${id} updated by ${req.user.name}`, req.user.id);

        res.status(200).json({ message: 'Note updated successfully', note: updatedNote, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note', error: error.message, success: false });
    }
};

// Delete Note
exports.deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found', success: false });
        }

        // Log activity after deleting the note
        await ActivityLogger.logActivity('delete_note', `Note with ID ${id} deleted by ${req.user.name}`, req.user.id);

        res.status(200).json({ message: 'Note deleted successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete note', error: error.message, success: false });
    }
};
