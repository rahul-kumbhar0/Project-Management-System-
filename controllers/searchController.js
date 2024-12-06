// controllers/searchController.js

const Task = require('../models/taskSchema'); // Assuming Task model is defined
const Bug = require('../models/bugSchema');   // Assuming Bug model is defined
const Project = require('../models/projectSchema'); // Assuming Project model is defined

exports.search = async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from the request
        
        // Validate the query
        if (!query) {
            return res.status(400).json({ message: 'Search query cannot be empty' });
        }

        // Convert the query to a regular expression for case-insensitive matching
        const regex = new RegExp(query, 'i');

        // Fetch tasks, bugs, and projects matching the query
        const tasks = await Task.find({ title: regex }); // Assuming you search by title
        const bugs = await Bug.find({ title: regex });   // Assuming you search by title
        const projects = await Project.find({ name: regex }); // Assuming you search by name

        // Send back the search results
        res.status(200).json({
            message: 'Search results found',
            data: {
                tasks,
                bugs,
                projects
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
