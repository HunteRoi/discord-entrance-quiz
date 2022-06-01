import { MessageOptions, MessageEditOptions } from 'discord.js';
import { OneToFiveElements } from './OneToFiveElements';
import { QuizEntry } from './QuizEntry';

export interface EntranceQuizOptions {
  quizEntries: OneToFiveElements<QuizEntry>;
  useDM: boolean;
  buttonLabel: string;
  formTitle: string;
  introductionMessage?: string | MessageOptions;
  formResponseWhenSubmitted: string | MessageEditOptions;
}
