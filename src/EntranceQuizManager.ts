export class EntranceQuizManager {
    constructor(client: any, questions: any[] | null = null) {
        if (!client) throw new Error('You must provide a client!');
        if (!questions) throw new Error('You must provide questions!');
    }
}