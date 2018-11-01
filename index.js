const commando = require('discord.js-commando');
const bot = new commando.Client();
const token = require('token.txt');

bot.registry
  .registerGroup('general', 'General')
  .registerDefaults()
  .registerCommandsIn(__dirname + "/commands");

// bot.on('message', (message) => {
//   if (message.content == '!startQuiz') {
//
//   }
// });

bot.login(token.readFileSync('DATA', 'utf8'));
