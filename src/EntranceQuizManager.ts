import { Client, GuildMember, Intents } from "discord.js";
import { EventEmitter } from "stream";

import { EntranceQuizOptions, QuizEntry } from "@types";

export class EntranceQuizManager extends EventEmitter {
    public readonly client!: Client;
    private readonly _options: EntranceQuizOptions;

    constructor(client: Client, options: EntranceQuizOptions = {
        quizEntries: [],
        useDM: true
    }) {
        super();

        if (!client) throw new Error('You must provide a client!');
        if (!options) throw new Error('You must provide options!');
        if (!options.quizEntries || options.quizEntries.length === 0) throw new Error('You must provide quiz entries!');

        const intents = new Intents(client.options.intents);
        if (options.useDM && !intents.has(Intents.FLAGS.DIRECT_MESSAGES))

            this.client = client;
        this._options = options;
    }

    public async startQuiz(member: GuildMember, quizEntries?: QuizEntry[]) {
        if (!quizEntries) {
            quizEntries = this._options.quizEntries;
        }

        for (const entry of quizEntries) {
            if (this._options.useDM) {
                member.
            }
        }
    }
}