import * as puppet from "puppeteer";
import {setupMetamask} from "./setupMetamask";
import {JSAML} from "@vlegm/utils";
import {MANIFEST_PATH} from "../config";

(async () => {
  const manifest = await JSAML.read(MANIFEST_PATH) as any;

  const browser = await puppet.launch({
    headless: false,
    args: [`--disable-extensions-except=${manifest.latest}`, `--load-extension=${manifest.latest}`]
  });

  await setupMetamask(browser);
})();
