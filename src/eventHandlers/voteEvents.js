const voteManager = require('../managers/voteManager');
const questionManager = require('../managers/questionManager'); // Ensure this import is correct

function setupVoteEvents(io, socket) {
    socket.on('vote', ({ lobbyId, vote }) => {
        if (!lobbyId || !(vote === 'Yes' || vote === 'No')) {
            console.log(`Invalid vote attempt - Missing or incorrect details. Lobby ID: ${lobbyId}, Vote: ${vote}`);
            return socket.emit('error', { message: "Failed to submit vote. Invalid details." });
        }

        const { success, votesSubmitted, totalPlayers, message } = voteManager.submitVote(lobbyId, socket.id, vote);

        if (!success) {
            console.log(`Vote submission failed for lobby ${lobbyId}. ${message}`);
            return socket.emit('error', { message: "Failed to submit vote." });
        }

        console.log(`Vote ${vote} received from ${socket.id} for lobby ${lobbyId}. ${votesSubmitted} out of ${totalPlayers} have voted.`);

        if (votesSubmitted === totalPlayers) {
            const results = voteManager.tallyVotes(lobbyId);
            console.log(`All ${totalPlayers} votes submitted for lobby ${lobbyId}. Tallying results...`);
            io.to(lobbyId).emit('voteResults', results);


            const newQuestion = questionManager.selectRandomQuestion(); // Get a new question
            questionManager.setCurrentQuestion(lobbyId, newQuestion); // Update the current question for the lobby
            io.to(lobbyId).emit('newQuestion', newQuestion);
            voteManager.clearVotes(lobbyId); // Clear votes for the new question round
            console.log(`New question sent to lobby ${lobbyId}. Resetting votes.`);

        }
    });
}

module.exports = setupVoteEvents;
