const lobbies = {};

const voteManager = {
    initializeLobby(lobbyId) {
        lobbies[lobbyId] = { players: [], votes: {} };
    },

    addPlayerToLobby(lobbyId, playerId) {
        if (!lobbies[lobbyId].players.includes(playerId)) {
            lobbies[lobbyId].players.push(playerId);
        }
    },

    submitVote(lobbyId, userId, vote) {
        if (!lobbies[lobbyId]) {
            return { success: false, message: "Lobby not found", votesSubmitted: 0, totalPlayers: 0 };
        }
        lobbies[lobbyId].votes[userId] = vote;
        const votesSubmitted = Object.keys(lobbies[lobbyId].votes).length;
        const totalPlayers = lobbies[lobbyId].players.length;
        return { success: true, votesSubmitted, totalPlayers };
    },

    tallyVotes(lobbyId) {
        const results = { Yes: 0, No: 0 };
        if (lobbies[lobbyId]) {
            Object.values(lobbies[lobbyId].votes).forEach(vote => results[vote]++);
        }
        return results;
    },

    allVotesSubmitted(lobbyId) {
        if (lobbies[lobbyId]) {
            return Object.keys(lobbies[lobbyId].votes).length === lobbies[lobbyId].players.length;
        }
        return false;
    },

    clearVotes(lobbyId) {
        if (lobbies[lobbyId]) {
            lobbies[lobbyId].votes = {};
        }
    }
};

module.exports = voteManager;
