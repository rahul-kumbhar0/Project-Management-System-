const Settings = require('../models/settingsSchema');
const ActivityLogger = require('./activityLogger'); // Import ActivityLogger

// Get settings for a user
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne({ user: req.user.id });
        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Settings not found for this user.',
            });
        }

        // Log the activity after retrieving the settings
        await ActivityLogger.logActivity('get_settings', `Settings retrieved by ${req.user.name}`, req.user.id);

        res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching settings',
            error: error.message,
        });
    }
};

// Update user settings
exports.updateSettings = async (req, res) => {
    const { preferences } = req.body;

    try {
        let settings = await Settings.findOne({ user: req.user.id });
        if (!settings) {
            settings = new Settings({ user: req.user.id, preferences });
        } else {
            settings.preferences = preferences;
        }
        await settings.save();

        // Log the activity after updating the settings
        await ActivityLogger.logActivity('update_settings', `Settings updated by ${req.user.name}`, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully.',
            settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating settings',
            error: error.message,
        });
    }
};
