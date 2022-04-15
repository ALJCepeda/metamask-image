import {launch} from "./launch";
import {sendTransaction} from "./sendTransaction";
import {log1} from "../utils";

(async () => {
  const {browser, page} = await launch();
  await sendTransaction(page, browser, {});
  log1('Transaction successfully sent!');
  await browser.close();
})();
