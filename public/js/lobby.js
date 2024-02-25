export const lobby = {
    init(socket) {
        document.getElementById('createLobby').addEventListener('click', () => {
            socket.emit('createLobby');
        });

        const joinLobbyForm = document.getElementById('joinLobbyForm');
        joinLobbyForm.addEventListener('submit', event => {
            event.preventDefault();
            const lobbyCode = document.getElementById('lobbyCode').value.trim();
            if (lobbyCode) {
                console.log(`Attempting to join lobby ${lobbyCode}`);
                socket.emit('joinLobby', lobbyCode);
            }
        });
    }
};
