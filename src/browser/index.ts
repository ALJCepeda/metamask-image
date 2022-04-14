import * as puppet from "puppeteer";
import {fetchMetamask} from "./fetchMetamask";
import {setupMetamask} from "./setupMetamask";

(async () => {
  const metamaskPath = await fetchMetamask();
  const browser = await puppet.launch({
    headless: false,
    args: [`--disable-extensions-except=${metamaskPath}`, `--load-extension=${metamaskPath}`]
  });

  await setupMetamask(browser);
})();
