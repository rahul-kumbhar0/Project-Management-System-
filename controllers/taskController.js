const Task = require('../models/taskSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Changed import

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignee, projectId } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required.', success: false });
    }
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required.', success: false });
    }
    if (!assignee) {
      return res.status(400).json({ message: 'Assignee is required.', success: false });
    }

    // Create new task instance
    const task = new Task({ title, description, assignee, projectId });

    // Save task to database
    await task.save();

    // Log the activity
    await ActivityLogger.logActivity(
      'create_Task',
      `Task "${title}" created by ${req.user.name}`,
      req.user.id
    );

    // Return success response
    return res.status(201).json({ message: 'Task created successfully.', task, success: true });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Failed to create task.', error: error.message, success: false });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    // Fetch tasks and populate assignee and project details
    const tasks = await Task.find().populate('assignee', 'name').populate('projectId', 'name');

    // Return tasks
    return res.status(200).json({ tasks, success: true });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Failed to get tasks.', error: error.message, success: false });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    // Find and update task by ID
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.', success: false });
    }

    // Log the activity for task update
    await ActivityLogger.logActivity(
      'update_Task',
      `Task "${task.title}" updated by ${req.user.name}`,
      req.user.id
    );

    // Return success response
    return res.status(200).json({ message: 'Task updated successfully.', task, success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Failed to update task.', error: error.message, success: false });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find and delete task by ID
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.', success: false });
    }

    // Log the activity for task deletion
    await ActivityLogger.logActivity(
      'delete_Task',
      `Task "${task.title}" deleted by ${req.user.name}`,
      req.user.id
    );

    // Return success response
    return res.status(200).json({ message: 'Task deleted successfully.', success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Failed to delete task.', error: error.message, success: false });
  }
};
