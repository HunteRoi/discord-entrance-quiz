import { TextInputComponentOptions } from 'discord.js';

/**
 * A form entry
 *
 * @interface FormEntryBase
 * @extends {(Omit<TextInputComponentOptions, 'label' & 'value' & 'customId'>)}
 * @template T
 */
export interface FormEntryBase<T>
  extends Omit<TextInputComponentOptions, 'label' & 'value' & 'customId'> {
  /**
   * The id of the entry.
   *
   * @type {string}
   * @memberof FormEntryBase
   */
  customId: string;

  /**
   * The entry question.
   *
   * @type {string}
   * @memberof FormEntryBase
   */
  label: string;

  /**
   * The parser to transform the string response to the proper type.
   *
   * @memberof FormEntryBase
   */
  parser: (answer: string) => T;

  /**
   * The answer properly typed.
   *
   * @type {T}
   * @memberof FormEntryBase
   */
  answer?: T;
}

export interface BooleanFormEntry extends FormEntryBase<boolean> {
  /**
   * The expected type
   *
   * @type {'boolean'}
   * @memberof BooleanFormEntry
   */
  responseType: 'boolean';
}

export interface StringFormEntry extends FormEntryBase<string> {
  /**
   * The expected type.
   *
   * @type {'string'}
   * @memberof StringFormEntry
   */
  responseType: 'string';
}

export interface NumberFormEntry extends FormEntryBase<number> {
  /**
   * The expected type.
   *
   * @type {'number'}
   * @memberof NumberFormEntry
   */
  responseType: 'number';
}

export type FormEntry = BooleanFormEntry | StringFormEntry | NumberFormEntry;
