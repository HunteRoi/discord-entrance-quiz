export interface QuizEntryBase<T> {
    question: string;
    validResponses?: T[];
    parser: (value: string) => T;
}

export interface BooleanQuizEntry extends QuizEntryBase<boolean> { responseType: 'boolean' };
export interface StringQuizEntry extends QuizEntryBase<string> { responseType: 'string' };
export interface NumberQuizEntry extends QuizEntryBase<number> { responseType: 'number' };

export type QuizEntry = BooleanQuizEntry | StringQuizEntry | NumberQuizEntry;