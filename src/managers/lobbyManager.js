class LobbyManager {
  constructor() {
    this.lobbies = {};
    this.questions = ["Is pizza your favorite food?", "Do you like to travel?", "Are you a morning person?"]; // Example questions
  }

  generateLobbyId() {
    // Generate a random number between 0 and 9999
    const randomNumber = Math.floor(Math.random() * 10000);
    // Convert the number to a string and pad with leading zeros if necessary, to ensure it's always 4 digits
    const result = String(randomNumber).padStart(4, '0');
    return result;
  }


  getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    return this.questions[randomIndex];
  }

  createLobby(playerId) {
    const lobbyId = this.generateLobbyId();
    const initialQuestion = this.getRandomQuestion(); // Get a random question for the new lobby
    this.lobbies[lobbyId] = {
      players: [playerId],
      votes: {},
      question: initialQuestion // Assign the random question here
    };
    return lobbyId;
  }

  joinLobby(lobbyId, playerId) {
    if (this.lobbies[lobbyId]) {
      if (!this.lobbies[lobbyId].players.includes(playerId)) {
        this.lobbies[lobbyId].players.push(playerId);
        return { success: true, message: "Joined lobby successfully." };
      }
      return { success: false, message: "Player already in the lobby." };
    }
    return { success: false, message: "Lobby does not exist." };
  }

  getCurrentQuestion(lobbyId) {
    if (this.lobbies[lobbyId]) {
      return this.lobbies[lobbyId].question;
    }
    return null;
  }


  // Method to update the current question for a lobby
  setQuestion(lobbyId, question) {
    if (this.lobbies[lobbyId]) {
      this.lobbies[lobbyId].question = question;
    }
  }

  // Additional functionality as needed, such as handling votes, etc.
}

module.exports = new LobbyManager();
