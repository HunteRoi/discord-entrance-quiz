import { MessageOptions, MessageEditOptions } from 'discord.js';
import { OneToFiveElements } from './OneToFiveElements';
import { FormEntry } from './FormEntry';

export interface FormOptions {
  formEntries: OneToFiveElements<FormEntry>;
  useDM: boolean;
  buttonLabel: string;
  formTitle: string;
  introductionMessage?: string | MessageOptions;
  formResponseWhenSubmitted: string | MessageEditOptions;
}
