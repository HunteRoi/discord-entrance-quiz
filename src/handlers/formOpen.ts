import {
  ButtonInteraction,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from 'discord.js';

import { FormManager, FormManagerEvents } from '..';

export const handleFormOpen = async (
  manager: FormManager,
  interaction: ButtonInteraction
) => {
  const user = interaction.user;
  if (interaction.customId !== `form-start-${user.id}`) return;

  const modal = new Modal()
    .setTitle(manager.options.formTitle)
    .setCustomId(`form-${user.id}`);

  for (const entry of manager.options.formEntries) {
    const input = new TextInputComponent({
      ...entry,
    });
    const actionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(input);
    modal.addComponents(actionRow);
  }

  await interaction.showModal(modal);
  manager.emit(FormManagerEvents.formOpen, user);
};
