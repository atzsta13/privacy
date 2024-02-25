const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const setupLobbyEvents = require('./eventHandlers/lobbyEvents');
const setupVoteEvents = require('./eventHandlers/voteEvents');
const questionManager = require('./managers/questionManager');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    setupLobbyEvents(io, socket);
    setupVoteEvents(io, socket);

    // This is the correct place for the 'submitQuestion' listener
    socket.on('submitQuestion', ({ lobbyId, question }) => {
        // Validation for lobbyId and question can be added here
        console.log(`Custom question received for lobby ${lobbyId}: ${question}`);
        questionManager.addQuestion(question); // Add the custom question to the questions array
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
