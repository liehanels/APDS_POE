export class RegEx {
    // Method to test if a string contains only numbers
    static testNumbers(string) {
        const pattern = '^[0-9]+$';
        const regex = new RegExp(pattern);
        return regex.test(string);
    }
    // Method to test if a string contains only alphanumerical characters
    static testAlphanumerical(string) {
        const pattern = '^[a-zA-Z0-9]+$';
        const regex = new RegExp(pattern);
        return regex.test(string);
    }
    // Method to test if a string contains only alphanumerical characters
    static testAlphabet(string) {
        const pattern = '^[a-zA-Z]+$';
        const regex = new RegExp(pattern);
        return regex.test(string);
    }
    // Method to test for special characters
    static testSpecialCharacters(string) {
        const pattern = `[^a-zA-Z0-9'"]+`;
        const regex = new RegExp(pattern);
        return regex.test(string);
    }
}