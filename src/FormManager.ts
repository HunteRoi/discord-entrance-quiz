import EventEmitter from "node:events";
import {
    ActionRowBuilder,
    ButtonBuilder,
    type ButtonInteraction,
    ButtonStyle,
    type Client,
    Events,
    type Interaction,
    type MessageEditOptions,
    ModalBuilder,
    type ModalSubmitInteraction,
    TextInputBuilder,
    type User,
} from "discord.js";

import { FormManagerEvents } from "./FormManagerEvents";
import type { FormEntry, FormManagerOptions } from "./types";
import type { OneToFiveElements } from "./types/OneToFiveElements";

/**
 * A manager to send a form to users through DM.
 *
 * @class FormManager
 * @extends {EventEmitter}
 */
export class FormManager extends EventEmitter {
    readonly #options: FormManagerOptions;

    /**
     * The Discord client.
     *
     * @type {Client}
     * @memberof FormManager
     */
    public readonly client: Client;

    /**
     * Creates an instance of {@link FormManager}.
     * @param {Client} client
     * @param {FormManagerOptions} [options={
     *       formEntries: [],
     *       buttonLabel: 'TAKE QUIZ',
     *       formTitle: 'Quiz Form',
     *       formResponseWhenSubmitted: 'Participation registered!',
     *     }]
     */
    constructor(
        client: Client,
        options: FormManagerOptions = {
            formEntries: [],
            buttonLabel: "TAKE QUIZ",
            formTitle: "Quiz Form",
            formResponseWhenSubmitted: "Participation registered!",
        },
    ) {
        super();

        if (!client) throw new Error("You must provide a client!");
        if (!options) throw new Error("You must provide options!");
        if (!options.formEntries || options.formEntries.length === 0)
            throw new Error("You must provide form entries!");

        if (options.formEntries.length > 5) {
            // tslint:disable-next-line:no-console
            console.warn(
                "You cannot have more than 5 entries. The additional will be ignored.",
            );
            options.formEntries = options.formEntries.splice(
                0,
                5,
            ) as OneToFiveElements<FormEntry>;
        }

        this.client = client;
        this.#options = options;

        this.client.on(
            Events.InteractionCreate,
            async (interaction: Interaction) => {
                if (interaction.isButton()) {
                    await this.#handleFormOpen.apply(this, [interaction]);
                } else if (interaction.isModalSubmit()) {
                    await this.#handleFormSubmit.apply(this, [interaction]);
                }
            },
        );
    }

    /**
     * Sends a button message in the user's DM.
     *
     * @param {User} user the user
     */
    public async sendFormButtonTo(user: User) {
        const openFormComponent = new ButtonBuilder()
            .setLabel(this.#options.buttonLabel)
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`form-start-${user.id}`);
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            openFormComponent,
        );

        const message =
            !this.#options.introductionMessage ||
            typeof this.#options.introductionMessage === "string"
                ? {
                      content: this.#options.introductionMessage,
                      components: [actionRow],
                  }
                : {
                      ...this.#options.introductionMessage,
                      components: [actionRow],
                  };

        await user.send(message);
        this.emit(FormManagerEvents.sendFormButton, user);
    }

    async #handleFormOpen(interaction: ButtonInteraction) {
        const user = interaction.user;
        if (interaction.customId !== `form-start-${user.id}`) return;

        const modal = new ModalBuilder()
            .setTitle(this.#options.formTitle)
            .setCustomId(`form-${user.id}`);

        for (const entry of this.#options.formEntries) {
            const input = new TextInputBuilder({ ...entry });
            const actionRow =
                new ActionRowBuilder<TextInputBuilder>().addComponents(input);
            modal.addComponents(actionRow);
        }

        await interaction.showModal(modal);
        this.emit(FormManagerEvents.formOpen, user);
    }

    async #handleFormSubmit(interaction: ModalSubmitInteraction) {
        const user = interaction.user;
        if (interaction.customId !== `form-${user.id}`) return;

        await interaction.deferReply();

        const formEntriesWithAnswers = this.#options.formEntries.map<FormEntry>(
            (entry: FormEntry) =>
                ({
                    ...entry,
                    answer: entry.parser(
                        interaction.fields.getTextInputValue(entry.customId),
                    ),
                }) as FormEntry,
        );

        const message: MessageEditOptions =
            typeof this.#options.formResponseWhenSubmitted === "string"
                ? {
                      content: this.#options.formResponseWhenSubmitted,
                      components: [],
                  }
                : {
                      ...this.#options.formResponseWhenSubmitted,
                      components: [],
                  };
        if (this.#options.canRetakeForm) {
            message.components = undefined;
        }

        await interaction.deleteReply();
        await interaction.message?.edit(message);

        this.emit(FormManagerEvents.formSubmit, formEntriesWithAnswers, user);
    }
}

/**
 * Emitted when the form button is sent.
 * @event FormManager#sendFormButton
 * @param {User} user
 * @example
 * manager.on(FormManagerEvents.sendFormButton, (user) => console.log(`Form sent to ${user.username}!`));
 */

/**
 * Emitted when the form button is clicked.
 * @event FormManager#formOpen
 * @param {User} user
 * @example
 * manager.on(FormManagerEvents.formOpen, (user) => console.log(`Form opened by ${user.username}!`));
 */

/**
 * Emitted when the form answers are submitted.
 * @event FormManager#formSubmit
 * @param {FormEntry[]} formEntriesWithAnswers
 * @param {User} user
 * @example
 * manager.on(FormManagerEvents.sendFormButton, (entries, user) => console.log(`Form answers submitted by ${user.username}!`, entries));
 */
