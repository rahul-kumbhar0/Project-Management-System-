const Comment = require('../models/commentSchema');
const Task = require('../models/taskSchema');
const Bug = require('../models/bugSchema');
const Project = require('../models/projectSchema');
const ActivityLogger = require('../controllers/activityLogger');  // Import ActivityLogger

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, parentId, parentType } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated.', success: false });
    }

    if (!content || !parentId || !parentType) {
      return res.status(400).json({ message: 'Content, parentId, and parentType are required.', success: false });
    }

    // Define a mapping for parent types to models
    const parentModels = { Task, Bug, Project };
    const ParentModel = parentModels[parentType];

    if (!ParentModel) {
      return res.status(400).json({ message: 'Invalid parentType.', success: false });
    }

    // Find the parent document by ID
    const parent = await ParentModel.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: `${parentType} not found.`, success: false });
    }

    // Create a new comment
    const comment = new Comment({ content, author: req.user.id, parentType, parent: parentId });
    await comment.save();

    // Optionally, add the comment reference to the parent document (if you want to maintain comments in the parent)
    // parent.comments.push(comment._id);
    // await parent.save();

    // Log the activity of creating a comment
    await ActivityLogger.logActivity(
      'create', 
      `Comment created on ${parentType} with ID ${parentId} by ${req.user.name}`,
      req.user.id
    );

    return res.status(201).json({ message: 'Comment created successfully.', comment, success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ message: 'Failed to create comment.', error: error.message, success: false });
  }
};

// Get comments for a specific parent (Task, Bug, or Project)
exports.getCommentsForParent = async (req, res) => {
  try {
    const { parentId, parentType } = req.params;

    if (!['Task', 'Bug', 'Project'].includes(parentType)) {
      return res.status(400).json({ message: 'Invalid parentType.', success: false });
    }

    // Fetch comments related to the parent document (Task, Bug, or Project)
    const comments = await Comment.find({ parent: parentId, parentType }).populate('author', 'name');

    // Log the activity of fetching comments
    await ActivityLogger.logActivity(
      'read', 
      `Comments retrieved for ${parentType} with ID ${parentId}`,
      req.user.id
    );

    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Failed to get comments.', error: error.message, success: false });
  }
};
