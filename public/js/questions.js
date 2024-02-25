export const questions = (function() {
    const socket = io();

    function requestQuestion(lobbyId) {
        console.log(`Requesting question for lobby ${lobbyId}`);
        socket.emit('requestQuestion', lobbyId);
    }

    return {
        request: requestQuestion
    };
})();
