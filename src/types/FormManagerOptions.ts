import { MessageOptions, MessageEditOptions } from 'discord.js';
import { OneToFiveElements } from './OneToFiveElements';
import { FormEntry } from './FormEntry';

/**
 * The manager options.
 *
 * @interface FormManagerOptions
 */
export interface FormManagerOptions {
  /**
   * The form entries. The array is limited to maximum 5 elements.
   *
   * @type {OneToFiveElements<FormEntry>}
   */
  formEntries: OneToFiveElements<FormEntry>;

  /**
   * The label used for the button component.
   *
   * @type {string}
   */
  buttonLabel: string;

  /**
   * The title of the form modal.
   *
   * @type {string}
   */
  formTitle: string;

  /**
   * The message sent with the button component.
   *
   * @type {(string | MessageOptions)}
   */
  introductionMessage?: string | MessageOptions;

  /**
   * The message sent when a form is submitted.
   *
   * @type {(string | MessageEditOptions)}
   */
  formResponseWhenSubmitted: string | MessageEditOptions;

  /**
   * Whether the form should stay in the DM or not, to allow users to submit answers again or not.
   *
   * @type {boolean}
   * @memberof FormManagerOptions
   */
  canRetakeForm?: boolean;
}
