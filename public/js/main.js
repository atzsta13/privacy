import { lobby } from './lobby.js';
import { ui } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentLobbyId = null;

    lobby.init(socket);

    socket.on('lobbyCreated', (data) => {
        currentLobbyId = data.lobbyId;
        ui.updateLobbyInfo(data.lobbyId, data.playerId);
        ui.hideLobbySection();
        ui.showSubmitQuestionSection(); // Show the submit question section
    });

    socket.on('newQuestion', (question) => {
        ui.showQuestion(question);
        ui.enableVoteButtons();
    });

    socket.on('voteResults', (results) => {
        ui.showVoteResults(results.Yes, results.No);
    });

    socket.on('joinedLobby', (data) => {
        currentLobbyId = data.lobbyId;
        ui.updateLobbyInfo(data.lobbyId, data.playerId);
        ui.hideLobbySection();
        ui.showSubmitQuestionSection(); // Show the submit question section
        if (data.question) {
            ui.showQuestion(data.question);
            ui.enableVoteButtons();
        }
    });

    socket.on('error', (error) => {
        console.error('Error from server:', error.message || 'An unknown error occurred');
    });

    ui.setupVoteButtons(socket, () => currentLobbyId);

    // Handling the send button click and enter keypress for the input field
    document.getElementById('sendQuestion').addEventListener('click', sendCustomQuestion);
    document.getElementById('customQuestionInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendCustomQuestion();
        }
    });

    function sendCustomQuestion() {
        const question = document.getElementById('customQuestionInput').value.trim();
        if (question) {
            socket.emit('submitQuestion', { lobbyId: currentLobbyId, question });
            document.getElementById('customQuestionInput').value = ''; // Clear input field
        }
    }
});
