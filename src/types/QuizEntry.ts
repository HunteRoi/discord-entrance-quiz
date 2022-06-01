import { TextInputComponentOptions } from 'discord.js';

export interface QuizEntryBase<T>
  extends Omit<TextInputComponentOptions, 'label' & 'value' & 'customId'> {
  customId: string;
  label: string;
  validResponses?: T[];
  parser: (answer: string) => T;
}

export interface BooleanQuizEntry extends QuizEntryBase<boolean> {
  responseType: 'boolean';
}
export interface StringQuizEntry extends QuizEntryBase<string> {
  responseType: 'string';
}
export interface NumberQuizEntry extends QuizEntryBase<number> {
  responseType: 'number';
}

export type QuizEntry = BooleanQuizEntry | StringQuizEntry | NumberQuizEntry;
