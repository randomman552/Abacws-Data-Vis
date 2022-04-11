/**
 * Formats the given unix timestamp as a human readable timestamp
 * @param value The unix timestamp to format
 * @returns Human readable timestamp
 */
export function unixTimeFormatter(value: string|number) {
    return new Date(Number(value)).toLocaleTimeString();
}

/**
 * Converts the field name given to the graph into a human readable name
 * For example, given temperature.value, this function will return only temperature.
 * @param value The value to format
 * @returns The formatted value as a string
 */
export function fieldNameFormatter(value: string) {
    return value.split(".")[0];
}