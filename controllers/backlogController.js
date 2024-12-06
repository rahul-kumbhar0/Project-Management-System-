const BacklogItem = require('../models/backlogItemSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Use the ActivityLogger class

// Create Backlog Item
exports.createBacklogItem = async (req, res) => {
  try {
    const { title, description, project, priority } = req.body;

    const newBacklogItem = new BacklogItem({
      title,
      description,
      project,
      priority,
      createdBy: req.user.id,
    });

    await newBacklogItem.save();

    // Log the activity using ActivityLogger
    try {
      await ActivityLogger.logActivity(
        'create', 
        `Backlog item "${newBacklogItem.title}" created in project "${newBacklogItem.project}" by ${req.user.name}`,
        req.user.id
      );
    } catch (logError) {
      console.error("Activity logging failed:", logError.message);
    }

    res.status(201).json({
      message: 'Backlog item created successfully',
      backlogItem: newBacklogItem,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create backlog item',
      error: error.message,
      success: false,
    });
  }
};

// Get All Backlog Items
exports.getAllBacklogItems = async (req, res) => {
  try {
    const backlogItems = await BacklogItem.find()
      .populate('project', 'title')
      .populate('createdBy', 'name');

    // Log the activity using ActivityLogger
    try {
      await ActivityLogger.logActivity(
        'view', 
        `User ${req.user.name} viewed all backlog items.`,
        req.user.id
      );
    } catch (logError) {
      console.error("Activity logging failed:", logError.message);
    }

    res.status(200).json({
      backlogItems,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get backlog items',
      error: error.message,
      success: false,
    });
  }
};

// Get Single Backlog Item by ID
exports.getBacklogItemById = async (req, res) => {
  try {
    const { backlogItemId } = req.params;
    const backlogItem = await BacklogItem.findById(backlogItemId)
      .populate('project', 'title')
      .populate('createdBy', 'name');

    if (!backlogItem) {
      return res.status(404).json({
        message: 'Backlog item not found',
        success: false,
      });
    }

    // Log the activity using ActivityLogger
    try {
      await ActivityLogger.logActivity(
        'view', 
        `User ${req.user.name} viewed backlog item "${backlogItem.title}".`,
        req.user.id
      );
    } catch (logError) {
      console.error("Activity logging failed:", logError.message);
    }

    res.status(200).json({
      backlogItem,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve backlog item',
      error: error.message,
      success: false,
    });
  }
};

// Update Backlog Item
exports.updateBacklogItem = async (req, res) => {
  try {
    const { backlogItemId } = req.params;
    const { title, description, project, priority } = req.body;

    const updatedBacklogItem = await BacklogItem.findByIdAndUpdate(
      backlogItemId,
      { title, description, project, priority },
      { new: true } // Returns the updated document
    );

    if (!updatedBacklogItem) {
      return res.status(404).json({
        message: 'Backlog item not found',
        success: false,
      });
    }

    // Log the activity using ActivityLogger
    try {
      await ActivityLogger.logActivity(
        'update', 
        `Backlog item "${updatedBacklogItem.title}" updated by ${req.user.name}.`,
        req.user.id
      );
    } catch (logError) {
      console.error("Activity logging failed:", logError.message);
    }

    res.status(200).json({
      message: 'Backlog item updated successfully',
      backlogItem: updatedBacklogItem,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update backlog item',
      error: error.message,
      success: false,
    });
  }
};

// Delete Backlog Item
exports.deleteBacklogItem = async (req, res) => {
  try {
    const { backlogItemId } = req.params;

    const deletedBacklogItem = await BacklogItem.findByIdAndDelete(backlogItemId);

    if (!deletedBacklogItem) {
      return res.status(404).json({
        message: 'Backlog item not found',
        success: false,
      });
    }

    // Log the activity using ActivityLogger
    try {
      await ActivityLogger.logActivity(
        'delete', 
        `Backlog item "${deletedBacklogItem.title}" deleted by ${req.user.name}.`,
        req.user.id
      );
    } catch (logError) {
      console.error("Activity logging failed:", logError.message);
    }

    res.status(200).json({
      message: 'Backlog item deleted successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete backlog item',
      error: error.message,
      success: false,
    });
  }
};
