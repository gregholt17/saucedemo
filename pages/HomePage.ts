import { Browser, ElementHandle, Locator } from "@playwright/test";
import { TimeoutOption } from "../interfaces/Homepage";
import { LoginPage } from "./LoginPage";
import { InventoryItem, InventoryItemName } from "../types/homepage";

class HomePage extends LoginPage {

    shoppingCartOpened: boolean;

    // imgDivSelector: string = 'div.inventory_item_img';
    imgSelector: string = 'img.inventory_item_img';
    nameSelector: string = 'div.inventory_item_name';
    descriptionSelector: string = 'div.inventory_item_desc';
    priceSelector: string = 'div.inventory_item_price';

    addItemSelectors: Record<InventoryItemName, string> = {
        'Sauce Labs Backpack': '#add-to-cart-sauce-labs-backpack',
        'Sauce Labs Bike Light': '#add-to-cart-sauce-labs-bike-light',
        'Sauce Labs Bolt T-Shirt': '#add-to-cart-sauce-labs-bolt-t-shirt',
        'Sauce Labs Fleece Jacket': '#add-to-cart-sauce-labs-fleece-jacket',
        'Sauce Labs Onesie': '#add-to-cart-sauce-labs-onesie'
    }

    shoppingCartSelector: string = '#shopping_cart_container';
    shoppingCartItemsSelector: string = 'div.cart_item';
    checkoutSelector: string = '#checkout';
    checkoutFirstNameSelector: string = '#first-name';
    checkoutLastNameSelector: string = '#last-name';
    checkoutPostalCodeSelector: string = '#postal-code';
    continueSelector: string = '#continue';
    finishSelector: string = '#finish';

    checkoutSuccessSelector: string = 'h2.complete-header';

    constructor(browser: Browser) {
        super(browser);
    }

    async initialiseHomePage({
        username,
        password,
        options,
    }: {
        username: string,
        password: string,
        options?: TimeoutOption,
    }) {
        await this.initialiseLoginPage();
        await this.login({ username, password, options });
        const successfulLogin = await this.validateLogin();
        if (!successfulLogin) {
            throw new Error(`Error logging in.`);
        }
    }

    async getInventoryItems(): Promise<InventoryItem[]> {
        const itemsLocator: Locator = this.page.locator('div.inventory_item');
        const itemsEHS: ElementHandle[] = await itemsLocator.elementHandles();
        let inventoryItems: InventoryItem[] = [];
        for (const itemEH of itemsEHS) {
            const imgEH: ElementHandle = await itemEH.waitForSelector(this.imgSelector);
            const imgUrl: string | null = await imgEH.getAttribute('src');
            const nameEH: ElementHandle = await itemEH.waitForSelector(this.nameSelector);
            const name: string | null = await nameEH.innerText();
            const descriptionEH: ElementHandle = await itemEH.waitForSelector(this.descriptionSelector);
            const description: string | null = await descriptionEH.innerText();
            const priceEH: ElementHandle = await itemEH.waitForSelector(this.priceSelector);
            const priceStr: string | null = await priceEH.innerText();
            const price: number = parseFloat(priceStr.replace("$",""));
            inventoryItems.push({
                name,
                imgUrl,
                description,
                price,
            });
        }
        return inventoryItems;
    }

    async addItemToCart(itemName: InventoryItemName): Promise<void> {
        let addItemSelector: string;
        addItemSelector = this.addItemSelectors[itemName];
        if (!addItemSelector) {
            throw new Error(`No selector available for item: \`${itemName}\``);
        }
        console.log(`Selector: \`${addItemSelector}\``);
        const locator: Locator = this.page.locator(addItemSelector)
        try {
            await locator.click({ timeout: 2000 });
        } catch (error) {
            throw new Error(`Failed clicking button for locator: \`${locator}\`` + 
                ` - Error:\n${error.message}`);
        }
        console.log(`Added item: \`${itemName}\` to cart.`)
    }

    async openShoppingCart(): Promise<void> {
        try {
            await this.page.locator(this.shoppingCartSelector).click({ timeout: 2000 });
        } catch (error) {
            throw new Error(`Failed opening shopping cart` + 
                ` - Error:\n${error.message}`);
        }
        this.shoppingCartOpened = true;
        console.log(`Opened shopping cart`);
    }

    async getCartItems(): Promise<any[]> {
        const locator: Locator = this.page.locator(this.shoppingCartItemsSelector);
        const elementHandles: ElementHandle[] = await locator.elementHandles();
        let cartItems: any[] = [];
        for (const elementHandle of elementHandles) {
            const quantityEH: ElementHandle = await elementHandle.waitForSelector('div.cart_quantity');
            const quantityStr: string = await quantityEH.innerText();
            const quantity: number = parseInt(quantityStr);
            const nameEH: ElementHandle = await elementHandle.waitForSelector('div.inventory_item_name');
            const name: string = await nameEH.innerText();
            const descriptionEH: ElementHandle = await elementHandle.waitForSelector('div.inventory_item_desc');
            const description: string = await descriptionEH.innerText();
            const priceEH: ElementHandle = await elementHandle.waitForSelector('div.inventory_item_price');
            const priceStr: string = await priceEH.innerText();
            const price = parseFloat(priceStr.replace('$',''));
            cartItems.push({
                name,
                description,
                price,
            });
        }
        return cartItems;
    }

    async clickCheckout(): Promise<void> {
        try {
            await this.page.locator(this.checkoutSelector).click({ timeout: 2000 });
        } catch (error) {
            throw new Error(`Failed checking out - Error:\n${error.message}`);
        }
    }

    async enterCheckoutInfo({
        firstName,
        lastName,
        postalCode,
    }: {
        firstName: string,
        lastName: string,
        postalCode: string
    }): Promise<void> {
        try {
            await this.page.locator(this.checkoutFirstNameSelector).fill(firstName);
            await this.page.locator(this.checkoutLastNameSelector).fill(lastName);
            await this.page.locator(this.checkoutPostalCodeSelector).fill(postalCode);
        } catch (error) {
            throw new Error(`Failed entering checkout info - Error:\n${error.message}`);
        }
    }

    async clickContinue(): Promise<void> {
        try {
            await this.page.locator(this.continueSelector).click({ timeout: 2000 });
        } catch (error) {
            throw new Error(`Failed clicking continue - Error:\n${error.message}`);
        }
    }

    async clickFinish(): Promise<void> {
        try {
            await this.page.locator(this.finishSelector).click({ timeout: 2000 });
        } catch (error) {
            throw new Error(`Failed clicking finish - Error:\n${error.message}`);
        }
    }

    async checkout({
        firstName,
        lastName,
        postalCode,
    }: {
        firstName: string,
        lastName: string,
        postalCode: string
    }): Promise<void> {
        await this.clickCheckout();
        await this.enterCheckoutInfo({ firstName, lastName, postalCode });
        await this.clickContinue();
        await this.clickFinish();
    }

    async verifyCheckoutSuccess(): Promise<boolean> {
        let checkoutSuccessEH: ElementHandle<SVGElement | HTMLElement> | null;
        try {
            checkoutSuccessEH = await this.page
                .locator(this.checkoutSuccessSelector)
                .elementHandle({ timeout: 2000 });
        } catch (error) {
            console.log(`Checkout Error:\n${error.message}`);
            return false;
        }
        const innerText: string = await this.page.locator(this.checkoutSuccessSelector).innerText();
        if (innerText === "Thank you for your order!") {
            return true;
        } else {
            return false;
        }
    }

}

export { HomePage };