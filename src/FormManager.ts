import {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  Interaction,
  User,
  Constants,
} from 'discord.js';
import EventEmitter from 'events';

import { FormManagerOptions, FormEntry } from './types';
import { OneToFiveElements } from './types/OneToFiveElements';
import { handleFormOpen, handleFormSubmit } from './handlers';
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
   * The manager options
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
          await handleFormOpen(this, interaction);
        } else if (interaction.isModalSubmit()) {
          await handleFormSubmit(this, interaction);
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
