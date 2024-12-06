const Capacity = require('../models/capacitySchema');
const ActivityLogger = require('../controllers/activityLogger');  // Import the Activity Logger

// Create or update capacity
exports.updateCapacity = async (req, res) => {
  const { user, project, totalHours, availableHours } = req.body;

  try {
    let capacity = await Capacity.findOne({ user, project });

    if (capacity) {
      // Update existing capacity
      capacity.totalHours = totalHours;
      capacity.availableHours = availableHours;
      capacity.allocatedHours = capacity.allocatedHours; // Keep allocated hours unchanged
    } else {
      // Create new capacity
      capacity = new Capacity({ user, project, totalHours, availableHours });
    }

    await capacity.save();

    // Log activity for creating or updating capacity
    await ActivityLogger.logActivity(
      capacity._id ? 'update' : 'create', 
      `Capacity ${capacity._id ? 'updated' : 'created'} for user ${user} on project ${project}`,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Capacity updated successfully.',
      capacity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating capacity',
      error: error.message,
    });
  }
};

// Get all capacities for a user or project
exports.getAllCapacities = async (req, res) => {
  try {
    const capacities = await Capacity.find().populate('user project');
    
    // Log activity for retrieving all capacities
    await ActivityLogger.logActivity(
      'read',
      'Retrieved all capacities.',
      req.user.id
    );

    res.status(200).json({
      success: true,
      capacities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching capacities',
      error: error.message,
    });
  }
};

// Get capacity by user ID
exports.getCapacityByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const capacities = await Capacity.find({ user: userId }).populate('project');
    if (!capacities.length) {
      return res.status(404).json({
        success: false,
        message: 'No capacities found for this user.',
      });
    }

    // Log activity for retrieving capacities for a specific user
    await ActivityLogger.logActivity(
      'read',
      `Retrieved capacities for user ${userId}.`,
      req.user.id
    );

    res.status(200).json({
      success: true,
      capacities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching capacities',
      error: error.message,
    });
  }
};

// Delete capacity by ID
exports.deleteCapacity = async (req, res) => {
  const { id } = req.params;

  try {
    const capacity = await Capacity.findByIdAndDelete(id);
    if (!capacity) {
      return res.status(404).json({
        success: false,
        message: 'Capacity not found.',
      });
    }

    // Log activity for deleting a capacity
    await ActivityLogger.logActivity(
      'delete',
      `Deleted capacity for user ${capacity.user} on project ${capacity.project}`,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Capacity deleted successfully.',
      capacity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting capacity',
      error: error.message,
    });
  }
};
