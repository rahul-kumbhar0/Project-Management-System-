const Team = require('../models/teamSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Import ActivityLogger

// Create a new team
exports.createTeam = async (req, res) => {
    try {
        const { name, members } = req.body;

        const newTeam = new Team({
            name,
            members,
            createdBy: req.user._id,
        });

        await newTeam.save();

        // Log the activity
        await ActivityLogger.logActivity('Team Created', `Team "${newTeam.name}" created by user ${req.user.name}`, req.user._id);

        res.status(201).json({
            message: 'Team created successfully',
            success: true,
            data: newTeam,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating team',
            success: false,
            error: error.message,
        });
    }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('members', 'name email');

        // Log the activity
        await ActivityLogger.logActivity('Viewed Teams', `User ${req.user.name} viewed all teams`, req.user._id);

        res.status(200).json({
            message: 'Teams retrieved successfully',
            success: true,
            data: teams,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving teams',
            success: false,
            error: error.message,
        });
    }
};

// Delete a team by ID
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const deletedTeam = await Team.findByIdAndDelete(teamId);

        if (!deletedTeam) {
            return res.status(404).json({
                message: 'Team not found',
                success: false,
            });
        }

        // Log the activity
        await ActivityLogger.logActivity('Team Deleted', `Team "${deletedTeam.name}" deleted by user ${req.user.name}`, req.user._id);

        res.status(200).json({
            message: 'Team deleted successfully',
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting team',
            success: false,
            error: error.message,
        });
    }
};
