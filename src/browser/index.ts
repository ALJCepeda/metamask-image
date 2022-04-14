import * as puppet from "puppeteer";
import {setupMetamask} from "./setupMetamask";
import {DEFAULT_DEST} from "../../scripts/fetchMetamask";

(async () => {
  const browser = await puppet.launch({
    headless: false,
    args: [`--disable-extensions-except=${DEFAULT_DEST}`, `--load-extension=${DEFAULT_DEST}`]
  });

  await setupMetamask(browser);
})();
