const commando = require('discord.js-commando');
const fetch = require('node-fetch');
const Player = require('./Player.js');

class StartQuizCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'startquiz',
      group: 'general',
      memberName: 'startquiz',
      description: 'Starts a quiz!'
    });

    this.questionAmount = 10;
    this.startingGame = false;
    this.quizset = [];
    this.currentQuestion = 0;
    this.currentAnswerCode = '';
    this.currentAnswer = '';
    this.playerList = [];

    client.on('message', message => {
      if (this.startingGame) {
        if (message.content === 'join') {
          console.log(message);
          //this.playerList = new Player(message.);
        }
      }

      if (message.content === this.currentAnswerCode) {
        message.reply(`${this.currentAnswerCode}) ${this.currentAnswer} is correct!`);
        this.nextQuestion(message);
      }
    });
  }

  async run(message, args) {
    message.channel.send(`Quiz about to start, type join to join`);
  }

  startQuiz(message) {
    fetch('https://opentdb.com/api.php?amount=' + this.questionAmount + '&category=15&difficulty=easy')
      .then(res => res.json())
      .then(quizdata => {
        this.quizset = quizdata.results;
        this.nextQuestion(message);
      });
  }

  nextQuestion(message) {
    if (this.questionAmount === this.currentQuestion) {
      return;
    }

    const { type, question, correct_answer, incorrect_answers } = this.quizset[this.currentQuestion];
    let answerList = [];

    if (type === 'multiple') {
      answerList = this.shuffle([correct_answer, ...incorrect_answers]);
      answerList.map(answer => answer.replace(new RegExp('&quot;', 'g'), '\"').replace(new RegExp('&#039;', 'g'), "\'"));
      this.currentAnswerCode = String.fromCharCode(97 + answerList.findIndex(answer => answer === correct_answer));
      this.currentAnswer = answerList.find(answer => answer === correct_answer);
    } else if (type === 'boolean') {
      answerList = this.shuffle(['True', 'False']);
      if (correct_answer === 'True') {
        this.currentAnswerCode = 'a';
        this.currentAnswer = 'True';
      } else {
        this.currentAnswerCode = 'b';
        this.currentAnswer = 'False';
      }
    }

    let messageText = `${question.replace(new RegExp('&quot;', 'g'), '\"').replace(new RegExp('&#039;', 'g'), "\'")}\n`;
    messageText += answerList.map((answer, index) => `${String.fromCharCode(97 + index)}) ${answer}`).join('\n');
    message.channel.send(messageText);
    this.currentQuestion++;
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}

module.exports = StartQuizCommand;
