import { Browser, ElementHandle, Locator } from "@playwright/test";
import { BasePage } from "./Base";
import { TimeoutOption } from "../interfaces/Homepage";

interface RetryOptions {
    retries: number,
    coolOff: number,
    timeout?: number,
}

class LoginPage extends BasePage {

    usernameInputSelector: string = '#user-name';
    usernameInput: Locator;
    passwordInputSelector: string = '#password';
    passwordInput: Locator;
    loginButtonSelector: string = '#login-button';
    loginButton: Locator;
    loginErrorSelector: string = `h3[data-test="error"]`;
    loginError: Locator;

    constructor(browser: Browser) {
        super(browser);
    }

    async initialiseLoginPage() {
        await this.initialiseBase();
        await this.page.goto('https://www.saucedemo.com/');
        this.setLoginPageLocators();
    }

    setLoginPageLocators(): void {
        this.usernameInput = this.page.locator(this.usernameInputSelector);
        this.passwordInput = this.page.locator(this.passwordInputSelector);
        this.loginButton = this.page.locator(this.loginButtonSelector);
        this.loginError = this.page.locator(this.loginErrorSelector);
    }

    async login({
        username,
        password,
        options,
    }: {
        username: string,
        password: string,
        options?: TimeoutOption,
    }): Promise<void> {
        await this.usernameInput.fill(username, options);
        await this.passwordInput.fill(password, options);
        await this.loginButton.click(options);
    }

    async validateLogin(options?: RetryOptions): Promise<boolean> {
        await this.waitForPageLoad();
        const { retries = 3, coolOff = 1000 } = options || {};
        let url: string | undefined;
        for (let x = 0; x <= retries; x++) {
            url = this.getPageUrl();
            if (url === 'https://www.saucedemo.com/inventory.html') {
                return true;
            } else {
                await this.pageSleep(coolOff);
            }
        }
        return false;
    }

    async checkForLoginError(options?: RetryOptions): Promise<string | undefined> {
        const { retries = 3, coolOff = 1000, timeout = 1000 } = options || {};
        await this.waitForPageLoad();
        let loginErrorEH: ElementHandle<SVGElement | HTMLElement> | null = null;
        for (let x = 0; x <= retries; x++) {
            try {
                loginErrorEH = await this.loginError.elementHandle({ timeout });
                break;
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
            if (x !== retries) {
                await this.pageSleep(coolOff);
            }
        }
        if (loginErrorEH) {
            const innerText = await loginErrorEH.innerText();
            return innerText;
        }
        return undefined;
    }

}

export { LoginPage };