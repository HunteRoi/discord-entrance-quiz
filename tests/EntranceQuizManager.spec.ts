import { Client, Intents } from 'discord.js';

import { EntranceQuizManager } from '../src/EntranceQuizManager';
import { EntranceQuizOptions, QuizEntry } from '../src/types';

describe('EntranceQuizManager', () => {
    let client: Client;
    let options: EntranceQuizOptions;

    beforeEach(() => {
        client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        client.removeAllListeners();

        options = {
            useDM: true,
            quizEntries: [
                {
                    question: 'How old are you?',
                    responseType: 'number',
                    parser: value => Number(value)
                }
            ]
        };
    });

    it('should throw an error when the quiz entries are empty', () => {
        expect(() => new EntranceQuizManager(client)).toThrowError('You must provide quiz entries!');
    });

    it('should not throw', () => {
        expect(() => new EntranceQuizManager(client, options)).not.toThrow();
    });

    describe('startQuiz', () => {
        it('should await a response for the first quiz entry', () => {

        });
    });
});
