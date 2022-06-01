import { Client, Intents, Constants } from 'discord.js';

import { EntranceQuizManager } from '../src/EntranceQuizManager';
import { EntranceQuizOptions } from '../src/types';

describe('EntranceQuizManager', () => {
  let client: Client;
  let options: EntranceQuizOptions;
  let manager: EntranceQuizManager;

  beforeEach(() => {
    client = new Client({
      intents: [Intents.FLAGS.DIRECT_MESSAGES],
      partials: [Constants.PartialTypes.CHANNEL],
    });
    client.removeAllListeners();

    options = {
      buttonLabel: 'TAKE QUIZ',
      formTitle: 'Quiz',
      formResponseWhenSubmitted: 'Participation registered!',
      useDM: true,
      quizEntries: [
        {
          customId: 'age',
          label: 'How old are you?',
          responseType: 'number',
          parser: (value) => Number(value),
          style: 'SHORT',
        },
      ],
    };

    manager = new EntranceQuizManager(client, options);
  });

  it('should throw an error when the quiz entries are empty', () => {
    expect(() => new EntranceQuizManager(client)).toThrowError(
      'You must provide quiz entries!'
    );
  });

  it('should not throw', () => {
    expect(() => new EntranceQuizManager(client, options)).not.toThrow();
  });

  // cannot test more due to Discord not being mockable :'(
});
