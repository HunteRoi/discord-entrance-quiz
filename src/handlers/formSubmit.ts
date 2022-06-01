import { Message, ModalSubmitInteraction } from 'discord.js';

import { EntranceQuizManager, EntranceQuizManagerEvents } from '..';

export const handleFormSubmit = async (
  manager: EntranceQuizManager,
  interaction: ModalSubmitInteraction
) => {
  const quizEntriesWithAnswers = manager.options.quizEntries.map((entry) => ({
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
    EntranceQuizManagerEvents.quizAnswered,
    quizEntriesWithAnswers,
    interaction.user
  );
};
