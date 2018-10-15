const commando = require('discord.js-commando');
const bot = new commando.Client();

bot.registry
  .registerGroup('general', 'General')
  .registerDefaults()
  .registerCommandsIn(__dirname + "/commands");

// bot.on('message', (message) => {
//   if (message.content == '!startQuiz') {
//
//   }
// });

bot.login('NDk5MTk2MDUyNDE1NTc4MTQy.Dp4xJA.hHlpMcfwqc8QOxTdZf2pLn-8EFI');
