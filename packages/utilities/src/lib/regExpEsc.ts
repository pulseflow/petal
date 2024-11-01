/**
 * Cleans a string from regex injection
 * @param str The string to clean
 */
export const regExpEsc = (str: string): string => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
