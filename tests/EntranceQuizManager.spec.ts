import { EntranceQuizManager } from '../src/EntranceQuizManager';

describe('EntranceQuizManager', () => {
    it('should throw an error when client is null', () => {
        expect(() => new EntranceQuizManager(null)).toThrowError('You must provide a client!');
    });
});