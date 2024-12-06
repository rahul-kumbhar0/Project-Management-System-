const Report = require('../models/reportSchema');
const ActivityLogger = require('./activityLogger'); // Import ActivityLogger

// Create Report
exports.createReport = async (req, res) => {
    const { title, content, project } = req.body;

    if (!title || !content || !project) {
        return res.status(400).json({ message: 'Title, content, and project are required', success: false });
    }

    const newReport = new Report({
        title,
        content,
        createdBy: req.user.id,
        project,
    });

    try {
        await newReport.save();

        // Log activity after creating the report
        await ActivityLogger.logActivity('create_report', `Report created by ${req.user.name}`, req.user.id);

        res.status(201).json({ message: 'Report created successfully', report: newReport, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create report', error: error.message, success: false });
    }
};

// Get All Reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('createdBy', 'name').populate('project', 'name');
        res.status(200).json({ reports, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve reports', error: error.message, success: false });
    }
};

// Get Report by ID
exports.getReportById = async (req, res) => {
    const { id } = req.params;

    try {
        const report = await Report.findById(id).populate('createdBy', 'name').populate('project', 'name');
        if (!report) {
            return res.status(404).json({ message: 'Report not found', success: false });
        }

        // Log activity after retrieving the report
        await ActivityLogger.logActivity('get_report', `Report retrieved by ${req.user.name}`, req.user.id);

        res.status(200).json({ report, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve report', error: error.message, success: false });
    }
};

// Update Report
exports.updateReport = async (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;

    try {
        const updatedReport = await Report.findByIdAndUpdate(id, { title, content, status }, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found', success: false });
        }

        // Log activity after updating the report
        await ActivityLogger.logActivity('update_report', `Report updated by ${req.user.name}`, req.user.id);

        res.status(200).json({ message: 'Report updated successfully', report: updatedReport, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update report', error: error.message, success: false });
    }
};

// Delete Report
exports.deleteReport = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Report not found', success: false });
        }

        // Log activity after deleting the report
        await ActivityLogger.logActivity('delete_report', `Report deleted by ${req.user.name}`, req.user.id);

        res.status(200).json({ message: 'Report deleted successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete report', error: error.message, success: false });
    }
};
