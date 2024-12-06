const Project = require('../models/projectSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Changed import

exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, team, githubLink } = req.body;

    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      team,
      createdBy: req.user.id,
      githubLink,
    });

    await newProject.save();

    // Updated logActivity call to match the function signature
    await ActivityLogger.logActivity(
      'create_project',
      `Project ${name} created by ${req.user.name}`,
      req.user.id
    );

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create project',
      error: error.message,
      success: false,
    });
  }
};

// Other functions remain the same, just update the logActivity calls

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, startDate, endDate, team, githubLink } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, description, startDate, endDate, team, githubLink },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        message: 'Project not found',
        success: false,
      });
    }

    // Updated logActivity call
    await ActivityLogger.logActivity(
      'update_project',
      `Project ${name} updated by ${req.user.name}`,
      req.user.id
    );

    res.status(200).json({
      message: 'Project updated successfully',
      project: updatedProject,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update project',
      error: error.message,
      success: false,

    });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        message: 'Project not found',
        success: false,
      });
    }

    // Updated logActivity call
    await ActivityLogger.logActivity(
      'delete_project',
      `Project deleted by ${req.user.name}`,
      req.user.id
    );

    res.status(200).json({
      message: 'Project deleted successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete project',
      error: error.message,
      success: false,
    });
  }
};

// getAllProjects and getProjectById remain unchanged since they don't use logging
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('team', 'name').populate('createdBy', 'name');
    res.status(200).json({
      projects,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve projects',
      error: error.message,
      success: false,
    });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate('team', 'name').populate('createdBy', 'name');
    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
        success: false,
      });
    }
    res.status(200).json({
      project,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve project',
      error: error.message,
      success: false,
    });
  }
};

