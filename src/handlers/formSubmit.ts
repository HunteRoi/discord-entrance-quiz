import { Message, ModalSubmitInteraction } from 'discord.js';

import { FormManager, FormManagerEvents } from '..';

export const handleFormSubmit = async (
  manager: FormManager,
  interaction: ModalSubmitInteraction
) => {
  const formEntriesWithAnswers = manager.options.formEntries.map((entry) => ({
    ...entry,
    answer: entry.parser(interaction.fields.getTextInputValue(entry.customId)),
  }));
  const message =
    typeof manager.options.formResponseWhenSubmitted === 'string'
      ? {
          content: manager.options.formResponseWhenSubmitted,
          components: [],
        }
      : { ...manager.options.formResponseWhenSubmitted, components: [] };

  await interaction.deleteReply();
  await (interaction.message as Message<boolean>).edit(message);

  manager.emit(
    FormManagerEvents.formAnswered,
    formEntriesWithAnswers,
    interaction.user
  );
};
