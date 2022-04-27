import {launch} from "./launch";
import {sendTransaction} from "./sendTransaction";

(async () => {
  const {browser, page} = await launch({
    headless: false,
  });

  //await sendTransaction(page, browser, {});
  await browser.close();
})();
