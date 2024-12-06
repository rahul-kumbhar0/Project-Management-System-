const SprintRetrospective = require('../models/sprintRetrospectiveSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Import ActivityLogger

// Create a new Sprint Retrospective
exports.createSprintRetrospective = async (req, res) => {
    try {
        const { sprintId, feedback, actionItems } = req.body;

        if (!sprintId || !feedback || !actionItems) {
            return res.status(400).json({
                message: 'Sprint ID, feedback, and action items are required.',
                success: false,
            });
        }

        const newRetrospective = new SprintRetrospective({
            sprintId,
            feedback,
            actionItems,
            createdBy: req.user.id,
        });

        await newRetrospective.save();

        // Log activity for creating a sprint retrospective
        await ActivityLogger.logActivity(
            'create_SprintRetrospective',
            `Sprint Retrospective for Sprint ${sprintId} created by ${req.user.name}`,
            req.user.id
        );

        res.status(201).json({
            message: 'Sprint Retrospective created successfully',
            retrospective: newRetrospective,
            success: true,
        });
    } catch (error) {
        console.error('Error creating Sprint Retrospective:', error);
        res.status(500).json({
            message: 'Failed to create Sprint Retrospective',
            error: error.message,
            success: false,
        });
    }
};

// Get all Sprint Retrospectives
exports.getAllSprintRetrospectives = async (req, res) => {
    try {
        const retrospectives = await SprintRetrospective.find().populate('createdBy', 'name');

        // Log activity for retrieving all sprint retrospectives
        await ActivityLogger.logActivity(
            'get_All_SprintRetrospectives',
            `User ${req.user.name} retrieved all sprint retrospectives`,
            req.user.id
        );

        res.status(200).json({
            retrospectives,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching Sprint Retrospectives:', error);
        res.status(500).json({
            message: 'Failed to retrieve Sprint Retrospectives',
            error: error.message,
            success: false,
        });
    }
};

// Get Sprint Retrospective by ID
exports.getSprintRetrospectiveById = async (req, res) => {
    try {
        const { id } = req.params;
        const retrospective = await SprintRetrospective.findById(id).populate('createdBy', 'name');

        if (!retrospective) {
            return res.status(404).json({
                message: 'Sprint Retrospective not found',
                success: false,
            });
        }

        // Log activity for retrieving a sprint retrospective by ID
        await ActivityLogger.logActivity(
            'get_SprintRetrospective_ById',
            `User ${req.user.name} retrieved Sprint Retrospective with ID ${id}`,
            req.user.id
        );

        res.status(200).json({
            retrospective,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching Sprint Retrospective:', error);
        res.status(500).json({
            message: 'Failed to retrieve Sprint Retrospective',
            error: error.message,
            success: false,
        });
    }
};

// Update Sprint Retrospective
exports.updateSprintRetrospective = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback, actionItems } = req.body;

        const updatedRetrospective = await SprintRetrospective.findByIdAndUpdate(
            id,
            { feedback, actionItems },
            { new: true }
        );

        if (!updatedRetrospective) {
            return res.status(404).json({
                message: 'Sprint Retrospective not found',
                success: false,
            });
        }

        // Log activity for updating a sprint retrospective
        await ActivityLogger.logActivity(
            'update_SprintRetrospective',
            `Sprint Retrospective with ID ${id} updated by ${req.user.name}`,
            req.user.id
        );

        res.status(200).json({
            message: 'Sprint Retrospective updated successfully',
            retrospective: updatedRetrospective,
            success: true,
        });
    } catch (error) {
        console.error('Error updating Sprint Retrospective:', error);
        res.status(500).json({
            message: 'Failed to update Sprint Retrospective',
            error: error.message,
            success: false,
        });
    }
};

// Delete Sprint Retrospective
exports.deleteSprintRetrospective = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRetrospective = await SprintRetrospective.findByIdAndDelete(id);

        if (!deletedRetrospective) {
            return res.status(404).json({
                message: 'Sprint Retrospective not found',
                success: false,
            });
        }

        // Log activity for deleting a sprint retrospective
        await ActivityLogger.logActivity(
            'delete_SprintRetrospective',
            `Sprint Retrospective with ID ${id} deleted by ${req.user.name}`,
            req.user.id
        );

        res.status(200).json({
            message: 'Sprint Retrospective deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error deleting Sprint Retrospective:', error);
        res.status(500).json({
            message: 'Failed to delete Sprint Retrospective',
            error: error.message,
            success: false,
        });
    }
};
