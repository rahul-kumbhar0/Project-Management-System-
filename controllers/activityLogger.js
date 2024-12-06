// controllers/activityLogger.js
const ActivityLog = require('../models/activityLogSchema');
const logger = require('../utils/logger');

class ActivityLogger {
    // Log a new activity
    static async logActivity(action, details, userId) {
        try {
            const logEntry = new ActivityLog({
                user: userId,
                action,
                details,
                timestamp: new Date()
            });

            await logEntry.save();
            logger.info(`Activity logged: ${action} - ${details}`);
            return true;
        } catch (error) {
            logger.error(`Error logging activity: ${error.message}`);
            throw error;
        }
    }

    // Get activity logs for a specific user
    static async getUserActivities(userId) {
        try {
            const logs = await ActivityLog.find({ user: userId })
                .sort({ timestamp: -1 });
            return logs;
        } catch (error) {
            logger.error(`Error retrieving activity logs: ${error.message}`);
            throw error;
        }
    }
}

module.exports = ActivityLogger;