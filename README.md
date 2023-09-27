Note: In a real-life scenario the following would be included in the .gitignore but for simplicity I have refrained:
- .env
- data/auth/passwords.ts (the entry would be data/auth/*)

## 1. Git Clone
`git clone git@github.com:gregholt17/saucedemo.git`

## 2. Node version 18
`nvm use 18`

## 3. NPM Install
`npm install`

## 4. Install Playwright browsers
`npx playwright install`

## 5. Environment Variables
`ALL_TESTS_TIMEOUT_SEC`
Adjust if desired to set the timeout for all test cases (in seconds). (Default if not specified: 600000)

`DEFAULT_ACTION_TIMEOUT_MS`
Adjust if desired to set the default timeout for Playwright actions (in milliseconds). (Default if not specified: 5000)

## 6. Tests
`npm run login`
Test cases which test the login page - for the standard (valid password), standard (invalid password) and locked out users.

`npm run homepage`
Test cases which validate the content on the home/inventory page - for the standard user and problem user.

`npm run checkout`
Test cases which validate successful checkout of a random chosen inventory item.