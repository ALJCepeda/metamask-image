import { shell } from "@vlegm/cli";
import { normalize } from "path";
import {log1} from "@vlegm/cli/dist/utils/log";

(async () => {
  await shell('metamask', 'npx ts-node src/browser/index.ts', {
    hostSrc: normalize(`${__dirname}/../src`),
    containerDest: `/mnt/host/src`
  });

  log1('Done!');
})();