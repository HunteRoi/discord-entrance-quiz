import { Client, Intents } from 'discord.js';

import { EntranceQuizManager } from '../src/EntranceQuizManager';
import { EntranceQuizOptions } from '../src/types';

describe('EntranceQuizManager', () => {
    let client: Client;
    let options: EntranceQuizOptions;

    beforeEach(() => {
        client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        client.removeAllListeners();

        options = {
            quizEntries: [
                {}
            ]
        };
    });

    it('should throw an error when the quiz entries are empty', () => {
        expect(() => new EntranceQuizManager(client)).toThrowError('You must provide quiz entries!');
    });

    it('should not throw', () => {
        expect(() => new EntranceQuizManager(client, options)).not.toThrow();
    });


});
