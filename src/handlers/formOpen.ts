import {
  ButtonInteraction,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from 'discord.js';

import { EntranceQuizManager } from '..';

export const handleFormOpen = async (
  manager: EntranceQuizManager,
  interaction: ButtonInteraction
) => {
  const userid = interaction.user.id;

  if (interaction.customId !== `form-start-${userid}`) return;

  const modal = new Modal()
    .setTitle(manager.options.formTitle)
    .setCustomId(`form-${userid}`);

  for (const entry of manager.options.quizEntries) {
    const input = new TextInputComponent({
      ...entry,
    });
    const actionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(input);
    modal.addComponents(actionRow);
  }
  await interaction.showModal(modal);
};
