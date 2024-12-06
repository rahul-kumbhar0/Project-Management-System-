const Bug = require('../models/bugSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Import the ActivityLogger class

// Create a new bug
exports.createBug = async (req, res) => {
    try {
        // Create the bug and associate it with the project
        const bug = await Bug.create({ ...req.body, project: req.params.projectId });

        // Log the activity: Bug created in project
        await ActivityLogger.logActivity(
            'Bug Created', 
            `Bug with title "${bug.title}" created in project ${req.params.projectId}`,
            req.user.id
        );

        // Send response
        res.status(201).json({ success: true, bug });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all bugs for a project
exports.getBugsByProject = async (req, res) => {
    try {
        // Fetch bugs for the given project
        const bugs = await Bug.find({ project: req.params.projectId }).populate('assignee');

        // Log the activity: User viewed bugs for a project
        await ActivityLogger.logActivity(
            'Viewed Bugs', 
            `User viewed bugs for project ${req.params.projectId}`, 
            req.user.id
        );

        res.status(200).json({ success: true, bugs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a bug
exports.updateBug = async (req, res) => {
    try {
        // Find and update the bug
        const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!bug) {
            return res.status(404).json({ success: false, message: 'Bug not found' });
        }

        // Log the activity: Bug updated
        await ActivityLogger.logActivity(
            'Bug Updated', 
            `Bug with title "${bug.title}" updated in project ${bug.project}`, 
            req.user.id
        );

        res.status(200).json({ success: true, bug });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete a bug
exports.deleteBug = async (req, res) => {
    try {
        // Find and delete the bug
        const bug = await Bug.findByIdAndDelete(req.params.id);

        if (!bug) {
            return res.status(404).json({ success: false, message: 'Bug not found' });
        }

        // Log the activity: Bug deleted
        await ActivityLogger.logActivity(
            'Bug Deleted', 
            `Bug with title "${bug.title}" deleted from project ${bug.project}`, 
            req.user.id
        );

        res.status(200).json({ success: true, message: 'Bug deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
