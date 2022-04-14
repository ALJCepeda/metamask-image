import * as puppet from "puppeteer";
import {log1, verbose} from "../utils";

export async function setupMetamask(browser: puppet.Browser) {
  const seed = 'blanket echo model okay twin dress produce inhale above fine credit rain';
  const password = 'password1234';

  log1('Setting up metamask');
  verbose('Waiting for page');
  const page = await onPage(browser, 'chrome-extension://[a-z]+/home.html');

  verbose('Closing blank page');
  const pages = await browser.pages();
  await pages[0].close();

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

  verbose('Close popup');
  const popupCloseBtn = await page.waitForSelector('.popover-header__button');
  await popupCloseBtn.click();

  verbose('Navigate to https://app-dev.creaticles.com');
  await page.goto(' https://app-dev.creaticles.com');

  verbose('Connect wallet');
  const connectBtn = await page.waitForSelector('.Button_isPrimary__a_bSB');
  await connectBtn.click();


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
