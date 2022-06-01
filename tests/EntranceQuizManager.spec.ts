import { Client, Intents, Constants } from 'discord.js';

import { FormManager } from '../src/FormManager';
import { FormOptions } from '../src/types';

describe('FormManager', () => {
  let client: Client;
  let options: FormOptions;
  let manager: FormManager;

  beforeEach(() => {
    client = new Client({
      intents: [Intents.FLAGS.DIRECT_MESSAGES],
      partials: [Constants.PartialTypes.CHANNEL],
    });
    client.removeAllListeners();

    options = {
      buttonLabel: 'TAKE QUIZ',
      formTitle: 'Quiz Form',
      formResponseWhenSubmitted: 'Participation registered!',
      useDM: true,
      formEntries: [
        {
          customId: 'age',
          label: 'How old are you?',
          responseType: 'number',
          parser: (value) => Number(value),
          style: 'SHORT',
        },
      ],
    };

    manager = new FormManager(client, options);
  });

  it('should throw an error when the form entries are empty', () => {
    expect(() => new FormManager(client)).toThrowError(
      'You must provide form entries!'
    );
  });

  it('should not throw', () => {
    expect(() => new FormManager(client, options)).not.toThrow();
  });

  // cannot test more due to Discord not being mockable :'(
});
