import { shell } from "@vlegm/cli";
import { normalize } from "path";

(async () => {
  await shell('metamask', 'npx ts-node src/browser/headless.ts', {
    hostSrc: normalize(`${__dirname}/../src`),
    containerDest: `/mnt/host/src`,
    environment: {
      'WALLET_SEED': process.env.WALLET_SEED,
      'WALLET_PASSWORD': process.env.WALLET_PASSWORD
    }
  });
})();
