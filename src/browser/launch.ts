import {JSAML} from "@vlegm/utils";
import {MANIFEST_PATH} from "../config";
import * as puppet from "puppeteer";
import {setupMetamask} from "./setupMetamask";
import {log2} from "../utils";
import {XVFBStub} from "../types";

const seed = 'blanket echo model okay twin dress produce inhale above fine credit rain';
const password = 'password1234';

export async function launch(headless:boolean = true, xvfb?:XVFBStub) {
  if(headless === true && !xvfb) {
    throw new Error('Need a virtual display to run headless');
  }

  const manifest = await JSAML.read(MANIFEST_PATH) as any;
  const args = [
    `--disable-extensions-except=${manifest.latest}`,
    `--load-extension=${manifest.latest}`,
    '--no-sandbox',
    '--start-fullscreen'
  ];

  if(headless === true) {
    args.push(`--display=${xvfb._display}`);
  }

  log2('Launching with:', args);

  const browser = await puppet.launch({
    headless: false,
    args
  });

  const page = await setupMetamask(browser, seed, password);

  return { browser, page };
}
