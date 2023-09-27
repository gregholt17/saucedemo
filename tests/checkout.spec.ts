import { test, expect, chromium, Browser } from '@playwright/test';
import * as dotenv from 'dotenv';
import { USERS } from '../enums/users';
import { ENV_VARS } from '../env';
import { TimeoutOption } from '../interfaces/Homepage';
import { HomePage } from '../pages/homepage';
import { GET_USER_PASSWORD } from '../utils';
import { InventoryItem, InventoryItemName } from '../types/homepage';
dotenv.config();

const { DEFAULT_ACTION_TIMEOUT_MS, ALL_TESTS_TIMEOUT_SEC } = ENV_VARS;

test.setTimeout(ALL_TESTS_TIMEOUT_SEC);

const pickRandomInventoryItem = (inventoryItems: InventoryItem[]): InventoryItem => {
    const numberOfInventoryItems: number = inventoryItems.length;
    const randomIndex = Math.floor(Math.random() * numberOfInventoryItems);
    return inventoryItems[randomIndex];
}

test('Checkout', async () => {
    const username: string = USERS.STANDARD_USER;
    const password: string = GET_USER_PASSWORD(username);
    const browser: Browser = await chromium.launch({ headless: false });
    const homePage: HomePage = new HomePage(browser);
    const options: TimeoutOption = { timeout: DEFAULT_ACTION_TIMEOUT_MS };
    await homePage.initialiseHomePage({ username, password, options});
    const inventoryItems: InventoryItem[] = await homePage.getInventoryItems();
    // console.log(`Inventory Items:\n${JSON.stringify(inventoryItems, null, 2)}`);
    const randomInventoryItem: InventoryItem = pickRandomInventoryItem(inventoryItems);
    const { name, description, price } = randomInventoryItem;
    // console.log(`Name: ${JSON.stringify(name, null, 2)} Price: ${JSON.stringify(price, null, 2)}`);
    await homePage.addItemToCart(name as InventoryItemName);
    await homePage.openShoppingCart();
    const cartItems: any[] = await homePage.getCartItems();
    // console.log(`Cart Items:\n${JSON.stringify(cartItems, null, 2)}`);
    expect(cartItems.length).toStrictEqual(1);
    const cartItem: any = cartItems[0];
    const { name: cartItemName, description: cartItemDescription, price: cartItemPrice } = cartItem;
    expect(cartItemName).toStrictEqual(name);
    expect(cartItemDescription).toStrictEqual(description);
    expect(cartItemPrice).toStrictEqual(price);
    await homePage.checkout({
        firstName: 'Firstname',
        lastName: 'Lastname',
        postalCode: 'Postcode',
    });
    const checkoutSuccess: boolean = await homePage.verifyCheckoutSuccess();
    expect(checkoutSuccess).toBe(true);
});