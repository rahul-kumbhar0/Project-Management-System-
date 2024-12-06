const Sprint = require('../models/sprintSchema');
const Project = require('../models/projectSchema');
const ActivityLogger = require('./activityLogger'); // Import the Activity Logger

// Create Sprint
exports.createSprint = async (req, res) => {
  try {
    const { title, startDate, endDate, goal, project } = req.body;

    // Check if the project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({
        message: 'Project not found',
        success: false,
      });
    }

    const newSprint = new Sprint({
      title,
      startDate,
      endDate,
      goal,
      project,
    });

    await newSprint.save();

    // Log the activity after creating the sprint
    await ActivityLogger.logActivity(
      'create',
      `Sprint "${newSprint.title}" created for project "${existingProject.name}"`,
      req.user.id // Assuming `req.user.id` contains the authenticated user's ID
    );

    res.status(201).json({
      message: 'Sprint created successfully',
      sprint: newSprint,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create sprint',
      error: error.message,
      success: false,
    });
  }
};

// Get All Sprints
exports.getAllSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find().populate('project', 'name');

    // Log the activity for retrieving all sprints
    await ActivityLogger.logActivity(
      'get_all',
      `All sprints retrieved by ${req.user.name}`,
      req.user.id
    );

    res.status(200).json({
      sprints,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve sprints',
      error: error.message,
      success: false,
    });
  }
};

// Get Single Sprint by ID
exports.getSprintById = async (req, res) => {
  try {
    const { id } = req.params;  // Access 'id' from route params
    const sprint = await Sprint.findById(id).populate('project', 'name');

    if (!sprint) {
      return res.status(404).json({
        message: 'Sprint not found',
        success: false,
      });
    }

    // Log the activity for retrieving a specific sprint by ID
    await ActivityLogger.logActivity(
      'get_by_id',
      `Sprint with ID ${id} retrieved by ${req.user.name}`,
      req.user.id
    );

    res.status(200).json({
      sprint,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve sprint',
      error: error.message,
      success: false,
    });
  }
};

// Update Sprint
exports.updateSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, goal, project } = req.body;

    const updatedSprint = await Sprint.findByIdAndUpdate(
      id,
      { title, startDate, endDate, goal, project },
      { new: true } // Returns the updated document
    );

    if (!updatedSprint) {
      return res.status(404).json({
        message: 'Sprint not found',
        success: false,
      });
    }

    // Log the activity after updating the sprint
    await ActivityLogger.logActivity(
      'update',
      `Sprint with ID ${id} updated by ${req.user.name}`,
      req.user.id
    );

    res.status(200).json({
      message: 'Sprint updated successfully',
      sprint: updatedSprint,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update sprint',
      error: error.message,
      success: false,
    });
  }
};

// Delete Sprint
exports.deleteSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSprint = await Sprint.findByIdAndDelete(id);

    if (!deletedSprint) {
      return res.status(404).json({
        message: 'Sprint not found',
        success: false,
      });
    }

    // Log the activity after deleting the sprint
    await ActivityLogger.logActivity(
      'delete',
      `Sprint with ID ${id} deleted by ${req.user.name}`,
      req.user.id
    );

    res.status(200).json({
      message: 'Sprint deleted successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete sprint',
      error: error.message,
      success: false,
    });
  }
};
