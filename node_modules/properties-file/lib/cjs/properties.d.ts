/// <reference types="node" />
import { KeyValuePairObject } from '.';
import { Property } from './property';
/**
 * Byte-order mark.
 */
export declare const BOM = "\uFEFF";
export declare const BOM_CODE_POINT: number | undefined;
/** The default end of line character. */
export declare const DEFAULT_END_OF_LINE_CHARACTER = "\n";
/**
 * Get the first end of line (EOL) character from multiline content.
 *
 * @param content - The content of a `.properties` file.
 *
 * @returns The multiline content's first end of line (EOL) character.
 */
export declare const getFirstEolCharacter: (content: string) => string | undefined;
/**
 * A class representing the content of a .properties file.
 */
export declare class Properties {
    /** Does the .properties content starts with a BOM character? */
    readonly hasBom: boolean;
    /** The end of line character. */
    readonly eolCharacter: string;
    /** `.properties` content split by line. */
    protected lines: string[];
    /** The collection of property object. */
    collection: Property[];
    /** Object associating keys with their starting line numbers. */
    keyLineNumbers: KeyLineNumbers;
    /**
     * Create `Properties` object.
     *
     * @param content - The content of a `.properties` file.
     */
    constructor(content: string | Buffer);
    /**
     * Parse the `.properties` content line by line.
     */
    protected parseLines(): void;
    /**
     * Add a property object into a properties object collection.
     *
     * @param property - A property object, or undefined.
     *
     * @returns Undefined so that we conveniently overwrite the property object.
     */
    private addToCollection;
    /**
     * Get keys that have collisions (more than one occurrence).
     */
    getKeyCollisions(): KeyCollisions[];
    /**
     * Get the key/value object representing the properties.
     *
     * @returns A key/value object representing the properties.
     */
    toObject(): KeyValuePairObject;
    /**
     * Format the object in `.properties`.
     *
     * @param endOfLineCharacter - The character used for end of lines.
     *
     * @returns The object in `.properties` format.
     */
    format(endOfLineCharacter?: '\n' | '\r\n'): string;
}
/**
 * Object associating keys with their line numbers.
 */
export type KeyLineNumbers = {
    [key: string]: number[];
};
/**
 * A class representing key within a .properties file that had collisions (more than one occurrence).
 */
export declare class KeyCollisions {
    /** The key with collisions. */
    key: string;
    /** The starting line numbers where collisions are found. */
    startingLineNumbers: number[];
    /**
     * Create a new key collision object.
     *
     * @param key - The key with collisions.
     * @param startingLineNumbers - The starting line numbers where collisions are found.
     */
    constructor(key: string, startingLineNumbers: number[]);
    /**
     * Get the number of the line from which the value will be used.
     */
    getApplicableLineNumber(): number | undefined;
}
