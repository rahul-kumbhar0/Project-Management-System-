const Feedback = require('../models/feedbackSchema');
const ActivityLogger = require('./activityLogger'); // Import ActivityLogger

// Create Feedback
exports.createFeedback = async (req, res) => {
    try {
        const feedback = new Feedback({
            userId: req.user.id,
            projectId: req.body.projectId,
            comment: req.body.comment,
            rating: req.body.rating,
        });

        await feedback.save();

        // Log activity after creating feedback
        await ActivityLogger.logActivity('create_feedback'
            , `Feedback created for project ${req.body.projectId} by ${req.user.name}`, req.user.id);

        res.status(201).json({ message: 'Feedback created successfully', feedback });
    } catch (error) {
        res.status(400).json({ message: 'Error creating feedback', error });
    }
};

// Get Feedback by Project
exports.getFeedbackByProject = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ projectId: req.params.projectId }).populate('userId', 'name');

        // Log activity after retrieving feedbacks for the project
        await ActivityLogger.logActivity('get_feedback_by_project', `Feedback retrieved for project ${req.params.projectId} by ${req.user.name}`, req.user.id);

        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error });
    }
};

// Update Feedback
exports.updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        feedback.comment = req.body.comment || feedback.comment;
        feedback.rating = req.body.rating || feedback.rating;
        await feedback.save();

        // Log activity after updating feedback
        await ActivityLogger.logActivity('update_feedback', `Feedback updated for project ${feedback.projectId} by ${req.user.name}`, req.user.id);

        res.status(200).json({ message: 'Feedback updated successfully', feedback });
    } catch (error) {
        res.status(400).json({ message: 'Error updating feedback', error });
    }
};

// Delete Feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        // Log activity after deleting feedback
        await ActivityLogger.logActivity('delete_feedback', `Feedback deleted for project ${feedback.projectId} by ${req.user.name}`, req.user.id);

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error });
    }
};
