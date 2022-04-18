import { shell } from "@vlegm/cli";
import { normalize } from "path";

(async () => {
  await shell('metamask', 'npx ts-node src/browser/headed.ts', {
    hostSrc: normalize(`${__dirname}/../src`),
    containerDest: `/mnt/host/src`
  });
})();
