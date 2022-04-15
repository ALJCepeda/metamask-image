import {launch} from "./launch";
import {sendTransaction} from "./sendTransaction";
import XVFB = require("xvfb");
import {XVFBStub} from "../types";

(async () => {
  const xvfb:XVFBStub = new XVFB({
    xvfb_args: ['-screen', '0', '1280x720x24', '-ac']
  });
  xvfb.startSync();
  
  const {browser, page} = await launch(true, xvfb);
  await sendTransaction(page, browser, {});
  log1('Transaction successfully sent!');
  await browser.close();
  xvfb.stopSync();
})();
