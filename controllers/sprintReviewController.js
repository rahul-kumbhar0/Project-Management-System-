const SprintReview = require('../models/sprintReviewSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Import ActivityLogger

// Create a new Sprint Review
exports.createSprintReview = async (req, res) => {
    try {
        const { sprintId, feedback, demoLink } = req.body;

        if (!sprintId || !feedback) {
            return res.status(400).json({
                message: 'Sprint ID and feedback are required.',
                success: false,
            });
        }

        const newReview = new SprintReview({
            sprintId,
            feedback,
            demoLink,
            createdBy: req.user.id,
        });

        await newReview.save();

        // Log activity for creating a sprint review
        await ActivityLogger.logActivity(
            'create_SprintReview',
            `Sprint Review for Sprint ${sprintId} created by ${req.user.name}`,
            req.user.id
        );

        res.status(201).json({
            message: 'Sprint Review created successfully',
            review: newReview,
            success: true,
        });
    } catch (error) {
        console.error('Error creating Sprint Review:', error);
        res.status(500).json({
            message: 'Failed to create Sprint Review',
            error: error.message,
            success: false,
        });
    }
};

// Get all Sprint Reviews
exports.getAllSprintReviews = async (req, res) => {
    try {
        const reviews = await SprintReview.find().populate('createdBy', 'name');
        
        // Log activity for fetching all sprint reviews
        await ActivityLogger.logActivity(
            'get_All_SprintReviews',
            `User ${req.user.name} retrieved all sprint reviews`,
            req.user.id
        );

        res.status(200).json({
            reviews,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching Sprint Reviews:', error);
        res.status(500).json({
            message: 'Failed to retrieve Sprint Reviews',
            error: error.message,
            success: false,
        });
    }
};

// Get Sprint Review by ID
exports.getSprintReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await SprintReview.findById(id).populate('createdBy', 'name');

        if (!review) {
            return res.status(404).json({
                message: 'Sprint Review not found',
                success: false,
            });
        }

        // Log activity for fetching a sprint review by ID
        await ActivityLogger.logActivity(
            'get_SprintReview_ById',
            `User ${req.user.name} retrieved Sprint Review with ID ${id}`,
            req.user.id
        );

        res.status(200).json({
            review,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching Sprint Review:', error);
        res.status(500).json({
            message: 'Failed to retrieve Sprint Review',
            error: error.message,
            success: false,
        });
    }
};

// Update Sprint Review
exports.updateSprintReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback, demoLink } = req.body;

        const updatedReview = await SprintReview.findByIdAndUpdate(
            id,
            { feedback, demoLink },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({
                message: 'Sprint Review not found',
                success: false,
            });
        }

        // Log activity for updating a sprint review
        await ActivityLogger.logActivity(
            'update_SprintReview',
            `Sprint Review with ID ${id} updated by ${req.user.name}`,
            req.user.id
        );

        res.status(200).json({
            message: 'Sprint Review updated successfully',
            review: updatedReview,
            success: true,
        });
    } catch (error) {
        console.error('Error updating Sprint Review:', error);
        res.status(500).json({
            message: 'Failed to update Sprint Review',
            error: error.message,
            success: false,
        });
    }
};

// Delete Sprint Review
exports.deleteSprintReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await SprintReview.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({
                message: 'Sprint Review not found',
                success: false,
            });
        }

        // Log activity for deleting a sprint review
        await ActivityLogger.logActivity(
            'delete_SprintReview',
            `Sprint Review with ID ${id} deleted by ${req.user.name}`,
            req.user.id
        );

        res.status(200).json({
            message: 'Sprint Review deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error deleting Sprint Review:', error);
        res.status(500).json({
            message: 'Failed to delete Sprint Review',
            error: error.message,
            success: false,
        });
    }
};
