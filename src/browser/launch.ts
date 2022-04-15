import {JSAML} from "@vlegm/utils";
import {MANIFEST_PATH} from "../config";
import * as puppet from "puppeteer";
import {setupMetamask} from "./setupMetamask";

const seed = 'blanket echo model okay twin dress produce inhale above fine credit rain';
const password = 'password1234';

export async function launch(headless:boolean = true) {
  const manifest = await JSAML.read(MANIFEST_PATH) as any;

  const browser = await puppet.launch({
    headless,
    args: [`--disable-extensions-except=${manifest.latest}`, `--load-extension=${manifest.latest}`, '--no-sandbox', '--start-fullscreen', '--display=:99']
  });

  const page = await setupMetamask(browser, seed, password);

  return { browser, page };
}
