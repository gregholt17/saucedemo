import { test, expect, chromium, Browser } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';
import { LOGIN_ERRORS, USERS } from '../enums/users';
import { PASSWORDS } from '../data/auth/passwords';
import { ENV_VARS } from '../env';
import { TimeoutOption } from '../interfaces/Homepage';
dotenv.config();

const { DEFAULT_ACTION_TIMEOUT_MS, ALL_TESTS_TIMEOUT_SEC } = ENV_VARS;

const getUserPassword = (username: string): string => {
    let password: string;
    try {
        password = PASSWORDS[username];
        return password;
    } catch (error) {
        throw new Error(`Failed retrieving password` + 
            ` for username: \`${username}\``);
    }
}

const login = async(
    username: string,
    password: string
): Promise<{ page: LoginPage, success: boolean }> => {
    
    const browser: Browser = await chromium.launch({ headless: false });
    const loginPage: LoginPage = new LoginPage(browser);
    const options: TimeoutOption = { timeout: DEFAULT_ACTION_TIMEOUT_MS };
    await loginPage.initialiseLoginPage();
    await loginPage.login({ username, password, options });
    const successfulLogin = await loginPage.validateLogin();
    return { page: loginPage, success: successfulLogin };
}

const expectErrorMessage = async(
    loginPage: LoginPage,
    expectedErrorMessage: string,
): Promise<void> => {
    const actualErrorMessage: string | undefined = await loginPage.checkForLoginError();
    expect(actualErrorMessage).toStrictEqual(expectedErrorMessage);
}

test.setTimeout(ALL_TESTS_TIMEOUT_SEC);

test('Successful Login', async () => {
    const username: string = USERS.STANDARD_USER;
    const password: string = getUserPassword(username);
    const { page: loginPage, success } = await login(username, password);
    expect(success).toBe(true);
    await loginPage.close();
});

test('Unsuccessful Login', async () => {
    const username: string = USERS.STANDARD_USER;
    const password: string = 'WRONGPASSWORD';
    const { page: loginPage, success } = await login(username, password);
    expect(success).toBe(false);
    await expectErrorMessage(loginPage, LOGIN_ERRORS.INVALID);
    await loginPage.close();
});

test('Locked out user', async () => {
    const username: string = USERS.LOCKED_OUT_USER;
    const password: string = getUserPassword(username);
    const { page: loginPage, success } = await login(username, password);
    expect(success).toBe(false);
    await expectErrorMessage(loginPage, LOGIN_ERRORS.LOCKED_OUT_USER);
    await loginPage.close();
});