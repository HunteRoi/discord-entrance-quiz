/**
 * Events fired by the {@link FormManager}.
 *
 * @export
 * @enum {string}
 */
export enum FormManagerEvents {
    /**
     * Event emitted to notify that the form button has been sent.
     */
    sendFormButton = "sendFormButton",

    /**
     * Event emitted to notify that the form button has been clicked.
     */
    formOpen = "formOpen",

    /**
     * Event emitted to notify that the form answers have been submitted.
     */
    formSubmit = "formSubmit",
}
