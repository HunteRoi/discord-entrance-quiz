/**
 * Events fired by the {@link EntranceQuizManager}
 *
 * @export
 * @enum {string}
 */
export enum EntranceQuizManagerEvents {
    startQuiz = 'startQuiz',
    receiveQuizEntry = 'receiveQuizEntry',
    stopQuiz = 'stopQuiz',
    error = 'error',
}