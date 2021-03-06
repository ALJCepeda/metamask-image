import * as puppet from "puppeteer";
import {log1, verbose} from "../utils";

interface TransactionRequest {
  title?: string;
  description?: string;
  amount?: string;
}

export async function sendTransaction(page: puppet.Page, browser: puppet.Browser, request: TransactionRequest = {}) {
  log1('Sending Transaction');
  verbose('Request');
  const requestBtn = await page.waitForSelector('.Button_isPrimary__a_bSB');
  await requestBtn.click();

  verbose('Title');
  const titleInput = await page.waitForSelector('input[name="title"]');
  await titleInput.type(request.title || 'Test Request');

  verbose('Description');
  await page.type('textarea[name="description"]', request.description || 'This is a description for a Test Request')

  verbose('ETH Token');
  await page.select('select[name="token"]', '0x0000000000000000000000000000000000000000');

  verbose('Amount');
  const amountInput = await page.waitForSelector('input[name="offer"]');
  await amountInput.type(request.amount || '0.0001');

  await page.waitForTimeout(1000);

  verbose('Submit');
  const waitForWindow = new Promise(resolve => browser.on('targetcreated', (target: puppet.Target) => resolve(target.page()))) as Promise<puppet.Page>;
  const submitBtn = await page.waitForSelector('input[type="submit"]');
  await submitBtn.click();

  verbose('Waiting for submit window');
  const submitWindow = await waitForWindow;

  verbose('Confirm');
  const confirmBtn = await submitWindow.waitForSelector('button[data-testid="page-container-footer-next"]');
  await confirmBtn.click();

  verbose('Waiting for request to complete');
  await page.waitForNavigation({
    timeout:180000
  });

  verbose('Checking for transaction confirmed');
  await page.waitForSelector('.ToastTransaction_toast__3NJS_');

  log1('Transaction successfully sent!');
}
