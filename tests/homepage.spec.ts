import { test, expect, chromium, Browser } from '@playwright/test';
import * as dotenv from 'dotenv';
import { USERS } from '../enums/users';
import { ENV_VARS } from '../env';
import { TimeoutOption } from '../interfaces/Homepage';
import { HomePage } from '../pages/homepage';
import { InventoryItem } from '../types/homepage';
import { INVENTORY_ITEMS } from '../data/InventoryItems';
import { GET_USER_PASSWORD } from '../utils';
dotenv.config();

const { DEFAULT_ACTION_TIMEOUT_MS, ALL_TESTS_TIMEOUT_SEC } = ENV_VARS;

const validateHomepageItems = async(username: string): Promise<void> => {
    const password: string = GET_USER_PASSWORD(username);
    const browser: Browser = await chromium.launch({ headless: false });
    const homePage: HomePage = new HomePage(browser);
    const options: TimeoutOption = { timeout: DEFAULT_ACTION_TIMEOUT_MS };
    await homePage.initialiseHomePage({ username, password, options });
    const inventoryItems: InventoryItem[] = await homePage.getInventoryItems();
    expect(inventoryItems).toMatchObject(INVENTORY_ITEMS);
}

test.setTimeout(ALL_TESTS_TIMEOUT_SEC);

test('Standard User', async () => {
    const username: string = USERS.STANDARD_USER;
    await validateHomepageItems(username);
});

test('Problem User', async () => {
    const username: string = USERS.PROBLEM_USER;
    await validateHomepageItems(username);
});