const Label = require('../models/labelSchema');
const ActivityLogger = require('./activityLogger'); // Import ActivityLogger

// Create a new label
exports.createLabel = async (req, res) => {
    try {
        const { name, color } = req.body;

        // Ensure required fields are present
        if (!name || !color) {
            return res.status(400).json({
                message: 'Name and color are required fields',
                success: false,
            });
        }

        // Validate user from req
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Unauthorized user',
                success: false,
            });
        }

        const newLabel = new Label({
            name,
            color,
            createdBy: req.user._id,
        });

        await newLabel.save();

        // Log activity after creating the label
        await ActivityLogger.logActivity(
            'create_label',
            `Label "${name}" created by ${req.user.name || 'Unknown User'}`,
            req.user._id
        );

        res.status(201).json({
            message: 'Label created successfully',
            success: true,
            data: newLabel,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating label',
            success: false,
            error: error.message,
        });
    }
};

// Get all labels
exports.getAllLabels = async (req, res) => {
    try {
        // Validate user from req
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Unauthorized user',
                success: false,
            });
        }

        const labels = await Label.find();

        // Log activity after retrieving all labels
        await ActivityLogger.logActivity(
            'get_all_labels',
            `Labels retrieved by ${req.user.name || 'Unknown User'}`,
            req.user._id
        );

        res.status(200).json({
            message: 'Labels retrieved successfully',
            success: true,
            data: labels,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving labels',
            success: false,
            error: error.message,
        });
    }
};

// Delete a label by ID
exports.deleteLabel = async (req, res) => {
    try {
        const { labelId } = req.params;

        // Validate user from req
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: 'Unauthorized user',
                success: false,
            });
        }

        const deletedLabel = await Label.findByIdAndDelete(labelId);

        if (!deletedLabel) {
            return res.status(404).json({
                message: 'Label not found',
                success: false,
            });
        }

        // Log activity after deleting the label
        await ActivityLogger.logActivity(
            'delete_label',
            `Label "${deletedLabel.name}" deleted by ${req.user.name || 'Unknown User'}`,
            req.user._id
        );

        res.status(200).json({
            message: 'Label deleted successfully',
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting label',
            success: false,
            error: error.message,
        });
    }
};
