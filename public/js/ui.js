export const ui = {

    lastQuestion: '', // Add this to store the last question



    updateLobbyInfo(lobbyId, playerId) {
        document.getElementById('displayLobbyId').textContent = `Lobby ID: ${lobbyId}`;
        document.getElementById('lobbyInfo').classList.remove('hidden');
    },

    showQuestion(question) {
        this.lastQuestion = question; // Update lastQuestion before showing the new one
        document.getElementById('questionText').textContent = question;
        document.getElementById('questionSection').classList.remove('hidden');
        this.enableVoteButtons();
    },

    showVoteResults(yesVotes, noVotes) {
        const resultsElement = document.getElementById('voteResults');
        // Include the last question in the results display
        resultsElement.innerHTML = `<strong>Last Question:</strong> ${this.lastQuestion}<br/><strong>Results:</strong> Yes: ${yesVotes}, No: ${noVotes}`;
        resultsElement.classList.remove('hidden');
        // Optionally, clear the current question display or adjust UI as needed
    },

    hideVoteResults() {
        const resultsElement = document.getElementById('voteResults');
        resultsElement.classList.add('hidden');
        resultsElement.textContent = '';
    },

    hideLobbySection() {
        document.getElementById('lobbySection').classList.add('hidden');
    },

    setupVoteButtons(socket, getCurrentLobbyId) {
        document.getElementById('yesButton').addEventListener('click', () => {
            socket.emit('vote', { lobbyId: getCurrentLobbyId(), vote: 'Yes' });
            this.disableVoteButtons();
        });
        document.getElementById('noButton').addEventListener('click', () => {
            socket.emit('vote', { lobbyId: getCurrentLobbyId(), vote: 'No' });
            this.disableVoteButtons();
        });
    },

    disableVoteButtons() {
        document.getElementById('yesButton').disabled = true;
        document.getElementById('noButton').disabled = true;
    },

    enableVoteButtons() {
        document.getElementById('yesButton').disabled = false;
        document.getElementById('noButton').disabled = false;
    },


    showSubmitQuestionSection() {
        document.getElementById('submitQuestionSection').classList.remove('hidden');
    },

    hideSubmitQuestionSection() {
        document.getElementById('submitQuestionSection').classList.add('hidden');
    },

};
