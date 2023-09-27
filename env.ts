let ALL_TESTS_TIMEOUT_SEC: number = 1000*60*10;
const x = process.env.ALL_TESTS_TIMEOUT_SEC;
if (x) {
    try {
        ALL_TESTS_TIMEOUT_SEC = parseInt(x);
    } catch (error) {
        throw new Error(`Failed parsing integer for Environment Variable:` + 
            ` \`ALL_TESTS_TIMEOUT_SEC\` value: \`${x}\`` + 
            ` - Error: ${error.message}`)
    }
}

let DEFAULT_ACTION_TIMEOUT_MS: number = 5000;
const y = process.env.DEFAULT_ACTION_TIMEOUT_MS;
if (y) {
    try {
        DEFAULT_ACTION_TIMEOUT_MS = parseInt(y);
    } catch (error) {
        throw new Error(`Failed parsing integer for Environment Variable:` + 
            ` \`DEFAULT_ACTION_TIMEOUT_MS\` value: \`${y}\`` + 
            ` - Error: ${error.message}`)
    }
}

const ENV_VARS = {
    ALL_TESTS_TIMEOUT_SEC,
    DEFAULT_ACTION_TIMEOUT_MS,
}

export { ENV_VARS };