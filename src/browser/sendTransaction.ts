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
  const descriptionInput = await page.waitForSelector('textarea[name="description"]');
  await descriptionInput.type(request.description || 'This is a description for a Test Request');

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

  log1('Transaction successfully sent!');
}
