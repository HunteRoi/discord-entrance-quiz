const { Client, Intents, Constants } = require('discord.js');

const { FormManager } = require('../lib');

const client = new Client({
  intents: [Intents.FLAGS.DIRECT_MESSAGES],
  partials: [Constants.PartialTypes.CHANNEL],
});
const manager = new FormManager(client, {
  buttonLabel: 'TAKE QUIZ',
  formTitle: 'Quiz Form',
  formResponseWhenSubmitted: 'Participation registered.',
  introductionMessage: 'Take our quiz and try to win a reward!',
  useDM: true,
  formEntries: [
    {
      label: 'How old are you?',
      parser: (value) => Number(value),
      responseType: 'number',
      style: 'SHORT',
      maxLength: 3,
      minLength: 1,
      required: true,
      customId: 'age',
    },
  ],
});

client.once('ready', () => console.log('Connected!'));

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.author.id === 'USERID') {
    await manager.sendFormButtonTo(message.author);
  }
});

client.login('TOKEN');
