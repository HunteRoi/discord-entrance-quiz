import type { TextInputComponentData } from "discord.js";

/**
 * A form entry.
 *
 * @interface FormEntryBase
 * @extends {(Omit<TextInputComponentData, 'label' & 'value' & 'customId' & 'type'>)}
 * @template T
 */
export interface FormEntryBase<T>
    extends Omit<
        TextInputComponentData,
        "label" & "value" & "customId" & "type"
    > {
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

    /**
     * The raw value of the entry.
     *
     * @type {string}
     * @memberof FormEntryBase
     */
    raw?: string;
}

/**
 * A form entry that requires a boolean answer.
 */
export interface BooleanFormEntry extends FormEntryBase<boolean> {
    /**
     * The expected type.
     *
     * @type {'boolean'}
     * @memberof BooleanFormEntry
     */
    responseType: "boolean";
}

/**
 * A form entry that requires a string answer.
 */
export interface StringFormEntry extends FormEntryBase<string> {
    /**
     * The expected type.
     *
     * @type {'string'}
     * @memberof StringFormEntry
     */
    responseType: "string";
}

/**
 * A form entry that requires a number answer.
 */
export interface NumberFormEntry extends FormEntryBase<number> {
    /**
     * The expected type.
     *
     * @type {'number'}
     * @memberof NumberFormEntry
     */
    responseType: "number";
}

/**
 * A form entry, either boolean, string or number.
 */
export type FormEntry = Omit<
    BooleanFormEntry | StringFormEntry | NumberFormEntry,
    "type"
>;
