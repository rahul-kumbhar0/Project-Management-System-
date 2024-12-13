# Project Management System - Backend

## Overview

The **Project Management System** backend is designed to manage tasks, projects, sprints, team collaboration, and real-time notifications. It provides role-based access and is built to support multiple user types such as Admin, Project Manager, Scrum Master, Developer, and Client. The backend includes CRUD operations for tasks, bugs, comments, and sprints, as well as real-time updates via WebSocket.

## Features

- **User Management**: Role-based access control for Admins, Project Managers, Scrum Masters, Developers, and Clients.
- **Task Management**: Create, assign, and update tasks. Includes attachments and comments.
- **Bug Tracking**: Handle bugs with priority, severity, and team assignments.
- **Sprints**: Create and manage sprints, assign tasks, and track sprint progress.
- **Activity Logs**: Tracks actions performed by users for auditing purposes.
- **Real-Time Updates**: Using **Socket.io** for real-time notifications and updates on tasks, projects, and sprints.
- **Scrum Ceremonies**: Integration of daily scrum meetings, sprint reviews, and retrospectives.

## Technologies Used

- **Node.js** with **Express.js** for building the backend server.
- **MongoDB** with **Mongoose** for database management.
- **JWT** for authentication and session management.
- **Socket.io** for real-time updates.
- **Git** for version control.

## Installation

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/rahul-kumbhar0/Project-Management-System-.git
cd Project-Management-System/backend
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and configure the following:

```bash
MONGO_URI=<your-mongo-db-uri>  # MongoDB connection URI
JWT_SECRET=<your-jwt-secret>    # Secret key for JWT authentication
PORT=5000                      # Port for the backend server
```

### 4. Run the Server

Start the server:

```bash
npm start
```

Your backend will be available at `http://localhost:5000`.

## Directory Structure

- **controllers**: Contains the logic for handling requests and responses (CRUD operations).
  - e.g., `projectController.js`, `taskController.js`, `userController.js`
- **models**: Mongoose schemas for database collections.
  - e.g., `projectSchema.js`, `bugSchema.js`, `taskSchema.js`
- **routes**: Routes to handle API endpoints.
  - e.g., `projectRoutes.js`, `taskRoutes.js`, `userRoutes.js`
- **middleware**: Middleware for authentication and error handling.
  - e.g., `authMiddleware.js`, `errorMiddleware.js`
- **config**: Database and socket configuration.
  - e.g., `db.js`, `socket.js`
- **uploads**: Directory for storing uploaded files such as task attachments.

## API Endpoints

### Authentication

- **POST** `/api/auth/register`: Register a new user (Admin, Project Manager, Scrum Master, Developer, Client).
- **POST** `/api/auth/login`: Login and receive a JWT token for authentication.

### Users

- **GET** `/api/users`: Get all users (Admin only).
- **GET** `/api/users/:id`: Get a specific user by ID.
- **PUT** `/api/users/:id`: Update user details (Admin only).
- **DELETE** `/api/users/:id`: Delete a user (Admin only).

### Projects

- **POST** `/api/projects`: Create a new project (Admin, Project Manager).
- **GET** `/api/projects`: Get all projects (Admin, Project Manager).
- **GET** `/api/projects/:id`: Get a specific project.
- **PUT** `/api/projects/:id`: Update project details (Admin, Project Manager).
- **DELETE** `/api/projects/:id`: Delete a project (Admin, Project Manager).

### Tasks

- **POST** `/api/tasks`: Create a new task (Admin, Project Manager).
- **GET** `/api/tasks`: Get all tasks.
- **GET** `/api/tasks/:id`: Get a specific task.
- **PUT** `/api/tasks/:id`: Update task details (Admin, Project Manager, Developer).
- **DELETE** `/api/tasks/:id`: Delete a task (Admin, Project Manager).

### Sprints

- **POST** `/api/sprints`: Create a new sprint (Admin, Project Manager).
- **GET** `/api/sprints`: Get all sprints for a project.
- **GET** `/api/sprints/:id`: Get details of a specific sprint.
- **PUT** `/api/sprints/:id`: Update sprint details (Admin, Project Manager).
- **DELETE** `/api/sprints/:id`: Delete a sprint (Admin, Project Manager).

### Bugs

- **POST** `/api/bugs`: Create a new bug (Admin, Project Manager).
- **GET** `/api/bugs`: Get all bugs.
- **GET** `/api/bugs/:id`: Get a specific bug.
- **PUT** `/api/bugs/:id`: Update bug details (Admin, Project Manager, Developer).
- **DELETE** `/api/bugs/:id`: Delete a bug (Admin, Project Manager).

### Comments

- **POST** `/api/comments`: Add a comment to a task or bug.
- **GET** `/api/comments`: Get all comments for a specific task or bug.

### Scrum Ceremonies

- **POST** `/api/dailyScrum`: Add a daily scrum entry (Scrum Master).
- **POST** `/api/sprintReview`: Add a sprint review (Scrum Master).
- **POST** `/api/sprintRetrospective`: Add a sprint retrospective (Scrum Master).

## Real-Time Updates

Real-time notifications are provided for:

- Task status updates
- Sprint progress updates
- Comments on tasks or bugs
- Project status updates

These updates are pushed to clients via **Socket.io**.

## Role-Based Access Control (RBAC)

The system uses **Role-Based Access Control (RBAC)** to ensure users can access only what they are permitted to. The following roles exist:

- **Admin**: Full access to all functionality (user management, project oversight).
- **Project Manager**: Can manage tasks, projects, and sprints.
- **Scrum Master**: Facilitates Scrum ceremonies and manages impediments.
- **Developer**: Updates task status and works on tasks assigned to them.
- **Client**: View-only access to projects and tasks.

## Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework for Node.js.
- [MongoDB](https://www.mongodb.com/) - NoSQL database.
- [Mongoose](https://mongoosejs.com/) - ODM for MongoDB.
- [Socket.io](https://socket.io/) - Real-time communication library.
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication.
