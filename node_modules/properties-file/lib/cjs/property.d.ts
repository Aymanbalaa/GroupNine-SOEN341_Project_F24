import { PropertyLine } from './property-line';
/**
 * Object representing a property (key/value).
 */
export declare class Property {
    /** The content of one or multiple lines when applicable. */
    linesContent: string;
    /** The property key (unescaped). */
    key: string;
    /** The property key, including its escaped characters. */
    escapedKey: string;
    /** Is the key empty? */
    private hasNoKey;
    /** Does the key definition spread across multiple lines? */
    private hasMultilineKey;
    /** Starting line numbers of property objects with the same key. */
    keyCollisionLines: number[];
    /** Was the property's key used more than once? */
    hasKeyCollisions: boolean;
    /** The key/value pair separator */
    separator: string | undefined;
    /** The length of the key/value pair separator, including its whitespace characters. */
    separatorLength: number | undefined;
    /** The starting position of the key/value pair separator. */
    separatorPosition: number | undefined;
    /** The property value (unescaped). */
    value: string;
    /** The starting position of the value. */
    valuePosition: number | undefined;
    /** The property value, including its escaped characters. */
    escapedValue: string;
    /** Is the value empty? */
    private hasNoValue;
    /** Positions of the newline characters if any. */
    newlinePositions: number[];
    /** The line number at which the property starts. */
    readonly startingLineNumber: number;
    /** The line number at which the property ends. */
    endingLineNumber: number;
    /** The previous property object if it exists. */
    readonly previousProperty?: Property;
    /** The next property object if it exists. */
    nextProperty?: Property;
    /**
     * Create a new property object.
     *
     * @param propertyLine - A property line object.
     * @param startingLineNumber - The line number at which the property starts.
     */
    constructor(propertyLine: PropertyLine, startingLineNumber: number, previousProperty?: Property);
    /**
     * Set the next property object.
     *
     * @param property - The next property object
     */
    setNextProperty(property: Property): void;
    /**
     * Add the a line to a multiline property object.
     *
     * @param propertyLine - A property line object.
     */
    addLine(propertyLine: PropertyLine): void;
    /**
     * Set the property's key and value.
     */
    setKeyAndValue(): void;
    /**
     * Unescape the content from either key or value of a property.
     *
     * @param escapedContent - The content to unescape.
     * @param startingLineNumber - The starting line number of the content being unescaped.
     *
     * @returns The unescaped content.
     *
     * @throws {@link Error}
     * This exception is thrown if malformed escaped unicode characters are present.
     */
    private unescapeLine;
    /**
     * Find the character separating the key from the value.
     */
    private findSeparator;
}
