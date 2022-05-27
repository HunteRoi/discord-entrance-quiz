import { Client, Intents } from 'discord.js';

import { EntranceQuizManager } from '../src/EntranceQuizManager';

describe('EntranceQuizManager', () => {
    let client: Client;
    let questions: any[];

    beforeEach(() => {
        client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        client.removeAllListeners();

        questions = [];
    });

    it('should throw an error when client is null', () => {
        expect(() => new EntranceQuizManager(null)).toThrowError('You must provide a client!');
    });

    it('should throw an error when the quiz questions are not provided', () => {
        expect(() => new EntranceQuizManager(client, null)).toThrowError('You must provide questions!');
    });

    it('should not throw', () => {
        expect(() => new EntranceQuizManager(client, questions)).not.toThrow();
    });
});