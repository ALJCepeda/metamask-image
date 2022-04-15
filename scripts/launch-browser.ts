import { shell } from "@vlegm/cli";
import { normalize } from "path";
import {log1} from "@vlegm/cli/dist/utils/log";

export async function launchBrowser() {
  await shell('metamask', 'npx ts-node src/browser/index.ts', {
    hostSrc: normalize(`${__dirname}/../src`),
    containerDest: `/mnt/host/src`
  });
}

launchBrowser().then(() => log1('Done!'));