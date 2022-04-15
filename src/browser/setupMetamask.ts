import * as puppet from "puppeteer";
import {log1, verbose} from "../utils";

const seed = 'blanket echo model okay twin dress produce inhale above fine credit rain';
const password = 'password1234';

export async function setupMetamask(browser: puppet.Browser) {
  log1('Setting up metamask');
  verbose('Waiting for page');
  const page = await onPage(browser, 'chrome-extension://[a-z]+/home.html');

  verbose('Closing blank page');
  const pages = await browser.pages();
  await pages[0].close();

  await importWallet(page);
  await chooseMetamaskWallet(page, browser);
  await signMetamaskLogin(page, browser);
  await chooseTestNetwork(page, browser);

  return page
}

async function chooseTestNetwork(page: puppet.Page, browser:puppet.Browser) {
  verbose('Network button');
  const networkBtn = await page.waitForSelector('.Web3Network_network__eL0Bu');
  await networkBtn.click();

  verbose('Ropsten network');
  const waitForWindow = new Promise(resolve => browser.on('targetcreated', (target: puppet.Target) => resolve(target.page()))) as Promise<puppet.Page>;
  await page.$$eval('.Dropdown_button__wT3z_', elements => {
    const element = elements.find(element => element.innerHTML.includes('Ropsten')) as HTMLInputElement;
    element.click();
  });

  verbose('Network window');
  const networkWindow = await waitForWindow;

  verbose('Switch btn');
  const switchBtn = await networkWindow.waitForSelector('.btn-primary');
  await switchBtn.click();
}

async function signMetamaskLogin(page:puppet.Page, browser:puppet.Browser) {
  await page.waitForTimeout(1000);
  const waitForWindow = new Promise(resolve => browser.on('targetcreated', (target: puppet.Target) => resolve(target.page()))) as Promise<puppet.Page>;

  verbose('Start sign workflow');
  const signBtn = await page.waitForSelector('.Web3Signature_primary__78VHH');
  await signBtn.click();

  verbose('Waiting for sign window');
  const signatureWindow = await waitForWindow;

  verbose('Click sign button');
  const signBtn2 = await signatureWindow.waitForSelector('.request-signature__footer__sign-button');
  await signBtn2.click();
}

async function importWallet(page: puppet.Page) {
  verbose('Continue button')
  const continueBtn = await page.waitForSelector('.welcome-page button');
  await continueBtn.click();

  verbose('Import button');
  const importBtn = await page.waitForSelector('.first-time-flow button');
  await importBtn.click();

  verbose('Agree button');
  const agreeBtn = await page.waitForSelector('.btn-primary');
  await agreeBtn.click();

  verbose('Seed phrase');
  await inputSeed(page, seed);

  verbose('Password');
  const passwordInput = await page.waitForSelector('#password');
  await passwordInput.type(password);

  verbose('Password confirm');
  const passwordConfirmInput = await page.waitForSelector('#confirm-password');
  await passwordConfirmInput.type(password);

  verbose('Accept terms');
  const acceptTerms = await page.waitForSelector('.check-box');
  await acceptTerms.click();

  verbose('Restore');
  const restoreBtn = await page.waitForSelector('.btn-primary');
  await restoreBtn.click();
  await page.waitForNavigation();

  verbose('All done');
  const allDoneBtn = await page.waitForSelector('.btn-primary');
  await allDoneBtn.click();
  await page.waitForNavigation();
  await page.waitForTimeout(1000);

  verbose('Close popup');
  const popupCloseBtn = await page.waitForSelector('.popover-header__button');
  await popupCloseBtn.click();
}

async function chooseMetamaskWallet(page: puppet.Page, browser: puppet.Browser) {
  verbose('Navigate to https://app-dev.creaticles.com');
  await page.goto('https://app-dev.creaticles.com');

  verbose('Connect wallet');
  const connectBtn = await page.waitForSelector('.Button_isPrimary__a_bSB');
  await connectBtn.click();

  verbose('Select Metamask');
  const waitForWindow = new Promise(resolve => browser.on('targetcreated', (target: puppet.Target) => resolve(target.page()))) as Promise<puppet.Page>;
  await page.$$eval('.WalletOption_option___lNex', elements => {
    const element = elements.find(element => element.innerHTML.includes('MetaMask')) as HTMLInputElement;
    element.click();
  });

  verbose('Waiting for Notification Window')
  const notificationWindow = await waitForWindow;

  verbose('Click Next');
  const nextBtn = await notificationWindow.waitForSelector('.btn-primary');
  await nextBtn.click();

  verbose('Click continue');
  const continueBtn = await notificationWindow.waitForSelector('.page-container__footer-button.btn-primary');
  await continueBtn.click();
}

async function inputSeed(page: puppet.Page, seed: string) {
  const parts = seed.split(' ');

  for(const [index, part] of parts.entries()) {
    const seedInput = await page.waitForSelector(`#import-srp__srp-word-${index}`);
    await seedInput.click();
    await seedInput.type(part);
  }
}

async function onPage(browser: puppet.Browser, regex: string): Promise<puppet.Page>{
  return new Promise((resolve) => {
    browser.on('targetcreated', async (target: puppet.Target) => {
      if(target.url().match(regex)) {
        const page = target.page();
        resolve(page);
      }
    });
  });
}
