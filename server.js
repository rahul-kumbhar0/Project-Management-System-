const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const labelRoutes = require('./routes/labelRoutes');
const teamRoutes = require('./routes/teamRoutes');
const backlogRoutes = require('./routes/backlogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const bugRoutes = require('./routes/bugRoutes');
const sprintRoutes = require('./routes/sprintRoutes');
const dailyScrumRoutes = require('./routes/dailyScrumRoutes');
const sprintReviewRoutes = require('./routes/sprintReviewRoutes');
const sprintRetrospectiveRoutes = require('./routes/sprintRetrospectiveRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
const capacityRoutes = require('./routes/capacityRoutes');
const searchRoutes = require('./routes/searchRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Middleware imports
const errorMiddleware = require('./middleware/errorMiddleware');
const socketSetup = require('./config/socket');

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/backlog', backlogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/daily-scrum', dailyScrumRoutes);
app.use('/api/sprint-reviews', sprintReviewRoutes);
app.use('/api/sprint-retrospectives', sprintRetrospectiveRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/capacity', capacityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/projects', projectRoutes);

// Error handling middleware
app.use(errorMiddleware);

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
        
        // Start the server after DB connection
        socketSetup(server);
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Start application
connectDB();

// Global error handling
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => process.exit(1));
});


