import {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  Interaction,
  User,
  Constants,
  ButtonInteraction,
  Modal,
  TextInputComponent,
  ModalActionRowComponent,
  MessageEditOptions,
  ModalSubmitInteraction,
  Message,
} from 'discord.js';
import EventEmitter from 'events';

import { FormManagerOptions, FormEntry } from './types';
import { OneToFiveElements } from './types/OneToFiveElements';
import { FormManagerEvents } from './FormManagerEvents';

/**
 * A manager to send a form to users through DM.
 *
 * @class FormManager
 * @extends {EventEmitter}
 */
export class FormManager extends EventEmitter {
  /**
   * The Discord client.
   *
   * @type {Client}
   * @memberof FormManager
   */
  public readonly client!: Client;

  /**
   * The manager options.
   *
   * @type {FormManagerOptions}
   * @memberof FormManager
   */
  public readonly options: FormManagerOptions;

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
      buttonLabel: 'TAKE QUIZ',
      formTitle: 'Quiz Form',
      formResponseWhenSubmitted: 'Participation registered!',
    }
  ) {
    super();

    if (!client) throw new Error('You must provide a client!');
    if (!options) throw new Error('You must provide options!');
    if (!options.formEntries || options.formEntries.length === 0)
      throw new Error('You must provide form entries!');

    if (options.formEntries.length > 5) {
      console.warn(
        'You cannot have more than 5 entries. The additional will be ignore.'
      );
      options.formEntries = options.formEntries.splice(
        0,
        5
      ) as OneToFiveElements<FormEntry>;
    }

    const intents = new Intents(client.options.intents);
    if (!intents.has(Intents.FLAGS.DIRECT_MESSAGES)) {
      throw new Error('Intent DIRECT_MESSAGES is missing.');
    }
    if (!client.options.partials?.includes('CHANNEL')) {
      throw new Error('Partial CHANNEL is missing.');
    }

    this.client = client;
    this.options = options;

    this.client.on(
      Constants.Events.INTERACTION_CREATE,
      async (interaction: Interaction) => {
        if (interaction.isButton()) {
          await this.handleFormOpen(interaction);
        } else if (interaction.isModalSubmit()) {
          await this.handleFormSubmit(interaction);
        }
      }
    );
  }

  /**
   * Sends a button message in the user's DM.
   *
   * @param {User} user the user
   */
  public async sendFormButtonTo(user: User) {
    const openFormComponent = new MessageButton()
      .setLabel(this.options.buttonLabel)
      .setStyle('PRIMARY')
      .setCustomId(`form-start-${user.id}`);
    const actionRow = new MessageActionRow().addComponents(openFormComponent);

    const message =
      !this.options.introductionMessage ||
      typeof this.options.introductionMessage === 'string'
        ? {
            content: this.options.introductionMessage,
            components: [actionRow],
          }
        : { ...this.options.introductionMessage, components: [actionRow] };

    await user.send(message);
    this.emit(FormManagerEvents.sendFormButton, user);
  }

  /**
   * Handles the opening of the form modal.
   *
   * @private
   * @param {ButtonInteraction} interaction
   */
  private async handleFormOpen(interaction: ButtonInteraction) {
    const user = interaction.user;
    if (interaction.customId !== `form-start-${user.id}`) return;

    const modal = new Modal()
      .setTitle(this.options.formTitle)
      .setCustomId(`form-${user.id}`);

    for (const entry of this.options.formEntries) {
      const input = new TextInputComponent({
        ...entry,
      });
      const actionRow =
        new MessageActionRow<ModalActionRowComponent>().addComponents(input);
      modal.addComponents(actionRow);
    }

    await interaction.showModal(modal);
    this.emit(FormManagerEvents.formOpen, user);
  }

  /**
   * Handles the submitted form.
   *
   * @private
   * @param {ModalSubmitInteraction} interaction
   */
  private async handleFormSubmit(interaction: ModalSubmitInteraction) {
    const user = interaction.user;
    if (interaction.customId !== `form-${user.id}`) return;

    await interaction.deferReply();

    const formEntriesWithAnswers = this.options.formEntries.map(
      (entry) =>
        ({
          ...entry,
          answer: entry.parser(
            interaction.fields.getTextInputValue(entry.customId)
          ),
        } as FormEntry)
    );

    const message: MessageEditOptions =
      typeof this.options.formResponseWhenSubmitted === 'string'
        ? {
            content: this.options.formResponseWhenSubmitted,
            components: [],
          }
        : {
            ...this.options.formResponseWhenSubmitted,
            components: [],
          };
    if (this.options.canRetakeForm) {
      delete message.components;
    }

    await interaction.deleteReply();
    await (interaction.message as Message<boolean>).edit(
      message as MessageEditOptions
    );

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
