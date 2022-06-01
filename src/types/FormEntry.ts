import { TextInputComponentOptions } from 'discord.js';

export interface FormEntryBase<T>
  extends Omit<TextInputComponentOptions, 'label' & 'value' & 'customId'> {
  customId: string;
  label: string;
  validResponses?: T[];
  parser: (answer: string) => T;
}

export interface BooleanFormEntry extends FormEntryBase<boolean> {
  responseType: 'boolean';
}
export interface StringFormEntry extends FormEntryBase<string> {
  responseType: 'string';
}
export interface NumberFormEntry extends FormEntryBase<number> {
  responseType: 'number';
}

export type FormEntry = BooleanFormEntry | StringFormEntry | NumberFormEntry;
