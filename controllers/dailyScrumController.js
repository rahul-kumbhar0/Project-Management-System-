const DailyScrum = require('../models/dailyScrumSchema');
const ActivityLogger = require('./activityLogger');  // Import ActivityLogger

// Create a new Daily Scrum
exports.createDailyScrum = async (req, res) => {
  try {
    const { date, participants } = req.body;

    if (!date || !participants) {
      return res.status(400).json({ message: 'Date and participants are required.', success: false });
    }

    const dailyScrum = new DailyScrum({ date, participants });
    await dailyScrum.save();

    // Log the activity for creating the Daily Scrum
    await ActivityLogger.logActivity('create', `Daily Scrum created on ${date} with participants: ${participants.join(', ')}`, req.user.id);

    return res.status(201).json({ message: 'Daily Scrum created successfully', dailyScrum, success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create Daily Scrum', error: error.message || error, success: false });
  }
};

// Get all Daily Scrums
exports.getAllDailyScrums = async (req, res) => {
  try {
    const dailyScrums = await DailyScrum.find().populate('participants', 'name');
    res.status(200).json({ dailyScrums, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get Daily Scrums', error: error.message || error, success: false });
  }
};

// Get a single Daily Scrum by ID
exports.getDailyScrumById = async (req, res) => {
  try {
    const { id } = req.params;
    const dailyScrum = await DailyScrum.findById(id).populate('participants', 'name').populate('updates.user', 'name');

    if (!dailyScrum) {
      return res.status(404).json({ message: 'Daily Scrum not found', success: false });
    }

    res.status(200).json({ dailyScrum, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get Daily Scrum', error: error.message || error, success: false });
  }
};

// Update a Daily Scrum (add an update from a participant)
exports.addUpdateToDailyScrum = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, update } = req.body;

    if (!user || !update) {
      return res.status(400).json({ message: 'User and update text are required.', success: false });
    }

    const dailyScrum = await DailyScrum.findById(id);
    if (!dailyScrum) {
      return res.status(404).json({ message: 'Daily Scrum not found', success: false });
    }

    dailyScrum.updates.push({ user, update });
    await dailyScrum.save();

    // Log the activity for adding an update to Daily Scrum
    await ActivityLogger.logActivity('update', `Update added by user ${user} to Daily Scrum on ${dailyScrum.date}`, req.user.id);

    res.status(200).json({ message: 'Update added successfully', dailyScrum, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add update', error: error.message || error, success: false });
  }
};

// Delete a Daily Scrum by ID
exports.deleteDailyScrum = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedScrum = await DailyScrum.findByIdAndDelete(id);

    if (!deletedScrum) {
      return res.status(404).json({ message: 'Daily Scrum not found', success: false });
    }

    // Log the activity for deleting the Daily Scrum
    await ActivityLogger.logActivity('delete', `Daily Scrum for ${deletedScrum.date} deleted`, req.user.id);

    res.status(200).json({ message: 'Daily Scrum deleted successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Daily Scrum', error: error.message || error, success: false });
  }
};
