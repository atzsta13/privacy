let currentQuestionLobbies = {};
const questions = require('./questionData');

function addQuestion(newQuestion) {
  questions.push(newQuestion);
}



function selectRandomQuestion() {
  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
}

function getCurrentQuestion(lobbyId) {
  if (currentQuestionLobbies[lobbyId]) {
      return currentQuestionLobbies[lobbyId].question;
  } else {
      const newQuestion = selectRandomQuestion();
      currentQuestionLobbies[lobbyId] = { question: newQuestion, answers: {}, allAnswered: false };
      return newQuestion;
  }
}

function setCurrentQuestion(lobbyId, question) {
  if (!currentQuestionLobbies[lobbyId]) {
      currentQuestionLobbies[lobbyId] = { question, answers: {}, allAnswered: false };
  } else {
      currentQuestionLobbies[lobbyId].question = question;
  }
}


function setupQuestionEvents(socket, io) {
  socket.on('requestQuestion', (lobbyId) => {
      if (!currentQuestionLobbies[lobbyId]) {
          const question = selectRandomQuestion();
          currentQuestionLobbies[lobbyId] = { question, answers: {}, allAnswered: false };
          io.to(lobbyId).emit('question', question);
      } else {
          io.to(lobbyId).emit('question', currentQuestionLobbies[lobbyId].question);
      }
  });

  socket.on('sendAnswer', ({ answer, lobbyId, playerId }) => {
      if (currentQuestionLobbies[lobbyId] && !currentQuestionLobbies[lobbyId].allAnswered) {
          currentQuestionLobbies[lobbyId].answers[playerId] = answer;
          const lobbyPlayers = Object.keys(io.sockets.adapter.rooms.get(lobbyId));
          const answersCount = Object.keys(currentQuestionLobbies[lobbyId].answers).length;
          if (answersCount >= lobbyPlayers.length) {
              currentQuestionLobbies[lobbyId].allAnswered = true;
              io.to(lobbyId).emit('allAnswered', currentQuestionLobbies[lobbyId].answers);
          }
      }
  });
}

module.exports = { addQuestion, selectRandomQuestion, setupQuestionEvents, getCurrentQuestion, setCurrentQuestion };
