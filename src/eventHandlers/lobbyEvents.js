const lobbyManager = require('../managers/lobbyManager');
const questionManager = require('../managers/questionManager');
const voteManager = require('../managers/voteManager');

function setupLobbyEvents(io, socket) {
    socket.on('createLobby', () => {
        const lobbyId = lobbyManager.createLobby(socket.id);
        voteManager.initializeLobby(lobbyId);
        // Automatically adds creating player to the lobby
        voteManager.addPlayerToLobby(lobbyId, socket.id); // Ensure the creator is also added as a player
        socket.join(lobbyId);
        const question = questionManager.getCurrentQuestion(lobbyId);
        socket.emit('lobbyCreated', { lobbyId, playerId: socket.id, question });
        io.to(lobbyId).emit('newQuestion', question);
    });

    socket.on('joinLobby', (lobbyId) => {
        const { success, message } = lobbyManager.joinLobby(lobbyId, socket.id);
        if (success) {
            voteManager.addPlayerToLobby(lobbyId, socket.id); // Add joining player to the lobby
            socket.join(lobbyId);
            const question = questionManager.getCurrentQuestion(lobbyId);
            socket.emit('joinedLobby', { lobbyId, playerId: socket.id, question });
        } else {
            socket.emit('error', { message });
        }
    });
}

module.exports = setupLobbyEvents;
