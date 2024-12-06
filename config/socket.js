// config/socket.js
const { Server } = require('socket.io');

const socketSetup = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Set your client URL here if necessary
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log('New socket connection:', socket.id);

        // Define your socket event listeners here
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};

module.exports = socketSetup;
