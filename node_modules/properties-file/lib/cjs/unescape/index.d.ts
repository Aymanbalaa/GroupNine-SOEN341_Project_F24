/**
 * Unescape the content from either key or value of a property.
 *
 * @param escapedContent - The content to unescape.
 *
 * @returns The unescaped content.
 *
 * @throws {@link Error}
 * This exception is thrown if malformed escaped unicode characters are present.
 */
export declare const unescapeContent: (escapedContent: string) => string;
