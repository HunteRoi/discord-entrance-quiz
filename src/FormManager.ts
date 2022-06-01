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

import { FormOptions, FormEntry } from './types';
import { OneToFiveElements } from './types/OneToFiveElements';
import { handleFormOpen, handleFormSubmit } from './handlers';
import { FormManagerEvents } from './FormManagerEvents';

export class FormManager extends EventEmitter {
  public readonly client!: Client;
  public readonly options: FormOptions;

  constructor(
    client: Client,
    options: FormOptions = {
      formEntries: [],
      useDM: true,
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
    if (options.useDM) {
      if (!intents.has(Intents.FLAGS.DIRECT_MESSAGES))
        throw new Error('Intent DIRECT_MESSAGES is missing for DM feature.');
      if (!client.options.partials?.includes('CHANNEL'))
        throw new Error('Partial CHANNEL is missing for DM feature.');
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

  public async sendFormButtonTo(user: User) {
    this.emit(FormManagerEvents.sendFormButton);

    const openFormComponent = new MessageButton()
      .setLabel(this.options.buttonLabel)
      .setStyle('PRIMARY')
      .setCustomId(`form-start-${user.id}`);
    const actionRow = new MessageActionRow().addComponents(openFormComponent);

    if (this.options.useDM) {
      const message =
        !this.options.introductionMessage ||
        typeof this.options.introductionMessage === 'string'
          ? {
              content: this.options.introductionMessage,
              components: [actionRow],
            }
          : { ...this.options.introductionMessage, components: [actionRow] };

      await user.send(message);
    }
  }
}
