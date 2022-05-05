const puppeteer = require('puppeteer');

const Timeouts = {
  selector: 20000,
  load: 240000,
};

/**
 * Executes the entire login flow in Puppeteer and returns the local web storage.
 */
async function loginProcessHeadless({
  portalUrl,
  username,
  password,
}) {
  const browser = await puppeteer.launch({
    headless: true,
    /* Localhost cert is required to load https://localhost:1991 in puppeteer instance.
    Following property removes dependency on that cert by ignoring all HTTPS errors. */
    ignoreHTTPSErrors: true,
    // Sends all browser console messages to machine's console
    dumpio: false,
  });

  // Create the page and set the default timeouts.
  const page = await browser.newPage();
  page.setDefaultTimeout(Timeouts.selector);
  page.setDefaultNavigationTimeout(Timeouts.load);

  try {
    formatAndDisplayConsoleMessages('Starting the puppeteer login process.');

    await page.goto(portalUrl);
    await navigateToLoginPage(page);
    await selectMicrosoftPersonalAccount({ page });
    await submitCredentials({
      page,
      username,
      password,
    });

    formatAndDisplayConsoleMessages('Successfully logged in.');

  } catch (error) {
    await browser.close();
    formatAndDisplayConsoleMessages(error);

    throw error;
  }

  const localStorageData = await getLocalStorageData({ page })

  // Close the automated login browser.
  await browser.close();

  return {
    localStorageData
  };
}

/**
 * Click the "Log In" button and navigate to the Log In page.
 */
const navigateToLoginPage = async (page) => {
  try {
    formatAndDisplayConsoleMessages('Navigating to log in page.');

    await page.waitForSelector('[data-testid=loginButton]', { visible: true });
    await page.click('[data-testid=loginButton]');

    formatAndDisplayConsoleMessages('Successfully navigated to log in page.');
  } catch (error) {
    if (error instanceof puppeteer.errors.TimeoutError) {
      displayTimeoutErrors('Log In Page', error);
    }

    throw 'Error on Log In Page.';
  }
};

/*
 * Select Microsoft Personal Account provider.
 */
const selectMicrosoftPersonalAccount = async ({
  page,
}) => {
  let loginSelector;

  loginSelector = 'a[title="Personal Account"]';

  try {
    await page.waitForSelector(loginSelector, { visible: true, });
    formatAndDisplayConsoleMessages('Identity Provider Selector found.');

    await Promise.all([page.waitForNavigation(), page.click(loginSelector)]);
    formatAndDisplayConsoleMessages('Identity Provider successfully selected, navigating to Username Page.',);
  } catch (error) {
    formatAndDisplayConsoleMessages(
      'Identity Provider Selector not found on page. This is an optional page, verifying that email page is loaded instead.',
    );
    // If selector is not found, check if next page is loaded. If yes, it's a conditional page.
    const isEmailSelector = await page.waitForSelector('input[type="email"]', {
      visible: true,
    });

    if (!isEmailSelector) {

      if (error instanceof puppeteer.errors.TimeoutError) {
        displayTimeoutErrors('Identity Provider Page', error);
      }

      throw 'Error navigating to Identity Provider Page.';
    } else {
      formatAndDisplayConsoleMessages(
        'No Identity Provider Page found for selected tenant, navigating to Username Page.',
      );
    }
  }
};

/**
 * Enter and submit username/password credentials.
 */
const submitCredentials = async ({ page, username, password }) => {
  try {
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', username);
    await page.waitForSelector('input[type="submit"]', { visible: true });
    await Promise.all([page.waitForNavigation(), page.click('input[type="submit"]')]);
    formatAndDisplayConsoleMessages(
      'Username submitted successfully, navigating to Password Page.',
    );
  } catch (error) {
    await page.evaluate(() => {
      // Incorrect Username error
      const errorText = document.getElementById('usernameError')?.textContent;
      if (errorText) {
        formatAndDisplayConsoleMessages(`Incorrect Username: ${errorText}`);
      }
    });

    if (error instanceof puppeteer.errors.TimeoutError) {
      displayTimeoutErrors('Username Page', error);
    }

    throw 'Error on Username Page.';
  }

  try {
    formatAndDisplayConsoleMessages('Attempt to Supply Password');
    await page.waitForSelector('input[name="passwd"]', { visible: true });
    await page.type('input[name="passwd"]', password);
    await page.waitForSelector('input[type="submit"]', { visible: true });
    await Promise.all([page.waitForNavigation(), page.click('input[type="submit"]')]);

    // If password is submitted incorrectly, it navigates to another page and displays that error.
    // So, we have to verify if the navigation resulted in an error.
    let invalidPasswordError = false;

    try {
      invalidPasswordError = await page.evaluate(() => {
        return document.getElementById('passwordError')?.textContent;
      });
    } catch (error) {

    }

    if (invalidPasswordError) {
      throw invalidPasswordError;
    } else {
      formatAndDisplayConsoleMessages(
        'Password submitted successfully, navigating to home page.',
      );
    }
  } catch (error) {
    if (error instanceof puppeteer.errors.TimeoutError) {
      displayTimeoutErrors('Password Page Time Out', error);
    }

    throw 'Error on Password page.';
  }

  // May not be prompted for "Stay Signed In" preferences (silently fail).
  try {
    await page.waitForSelector('input[value="No"]', { visible: true });
    await Promise.all([page.waitForNavigation(), page.click('input[value="No"]')]);
  } catch (error) {
    formatAndDisplayConsoleMessages(
      'Stay Signed In page not found. This is an optional page, ignore if navigation to next page is successful.',
    );
  }
};

function formatAndDisplayConsoleMessages(message) {
  console.log(`<------ ${message} ------>`);
}

/**
 * Retrieves local browser storage data.
 */
async function getLocalStorageData({ page } = {}) {
  await page.waitForSelector('[data-testid=logoutButton]', { visible: true, delay: 10000 })

  return await page.evaluate(() => {
    const localStorageData = {};

    Object.keys(localStorage).forEach((key) => {
      localStorageData[key] = localStorage[key];
    });

    return localStorageData;
  });
}

function displayTimeoutErrors(pageName, error) {
  formatAndDisplayConsoleMessages(`Timeout Error on ${pageName}. ${error}`);
}

module.exports = loginProcessHeadless;
