import { Browser, BrowserContext, BrowserContextOptions, Page } from "@playwright/test";

class BasePage {

    browser: Browser;
    context: BrowserContext;
    page: Page;

    constructor(browser: Browser) {
        this.browser = browser;
    }

    setPage(page: Page): void {
        this.page = page;
    }

    async initialiseBase(
        contextOptions: BrowserContextOptions = {},
    ): Promise<void> {
        this.context = await this.browser.newContext(contextOptions);
        this.page = await this.context.newPage();
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('load');
    }

    async waitForNewPage(): Promise<Page> {
        const page: Page = await this.context.waitForEvent('page');
        return page;
    }

    async waitForAndSetNewPageAsDefault(): Promise<void> {
        const newPage: Page = await this.context.waitForEvent('page');
        this.page = newPage;
    }

    async bringPageToFront(page: Page): Promise<void> {
        try {
            await this.page.bringToFront();
        } catch (error) {
            throw new Error(`Failed bringing page to front` + 
                ` - Error:\n${error.message}>`);
        }
    }

    async bringCurrentPageToFront(): Promise<void> {
        await this.bringPageToFront(this.page);
    }

    async pageSleep(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout);
    }

    async getPageTitle(): Promise<string> {
        try {
            const pageTitle: string = await this.page.title();
            return pageTitle;
        } catch (error) {
            throw new Error(`Failed getting page title` + 
                ` - Error:\n${error.message}`);
        }
    }

    getPageUrl(): string | undefined {
        try {
            const pageUrl: string = this.page.url();
            return pageUrl;
        } catch (error) {
            console.error(`Failed getting page URL` + 
                ` - Error:\n${error.message}`);
        }
    }

    async waitForUrl(url: string): Promise<void> {
        try {
            await this.page.waitForURL(url);
        } catch (error) {
            throw new Error(`Failed waiting for URL: \`${url}\`` + 
                ` - Error:\n${error.message}`);
        }
    }

    async close(): Promise<void> {
        await this.browser.close();
    }

}

export { BasePage };