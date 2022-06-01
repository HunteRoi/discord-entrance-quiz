import {
  Message,
  MessageEditOptions,
  ModalSubmitInteraction,
} from 'discord.js';

import { FormEntry, FormManager, FormManagerEvents } from '..';

export const handleFormSubmit = async (
  manager: FormManager,
  interaction: ModalSubmitInteraction
) => {
  const user = interaction.user;
  if (interaction.customId !== `form-${user.id}`) return;

  await interaction.deferReply();

  const formEntriesWithAnswers = manager.options.formEntries.map(
    (entry) =>
      ({
        ...entry,
        answer: entry.parser(
          interaction.fields.getTextInputValue(entry.customId)
        ),
      } as FormEntry)
  );

  const message: MessageEditOptions =
    typeof manager.options.formResponseWhenSubmitted === 'string'
      ? {
          content: manager.options.formResponseWhenSubmitted,
          components: [],
        }
      : {
          ...manager.options.formResponseWhenSubmitted,
          components: [],
        };
  if (manager.options.canRetakeForm) {
    delete message.components;
  }

  await interaction.deleteReply();
  await (interaction.message as Message<boolean>).edit(
    message as MessageEditOptions
  );

  manager.emit(FormManagerEvents.formSubmit, formEntriesWithAnswers, user);
};
