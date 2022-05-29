import { Client } from "discord.js";
import { EventEmitter } from "stream";

import { EntranceQuizOptions } from "@types";

export class EntranceQuizManager extends EventEmitter {
    public readonly client: Client;
    private readonly _options: EntranceQuizOptions;

    constructor(client: Client, options: EntranceQuizOptions = { quizEntries: [] }) {
        super();

        if (!client) throw new Error('You must provide a client!');
        if (!options) throw new Error('You must provide options!');
        if (!options.quizEntries || options.quizEntries.length === 0) throw new Error('You must provide quiz entries!');

        this.client = client;
        this._options = options;
    }
}