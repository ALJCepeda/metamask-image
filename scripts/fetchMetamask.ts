import {get} from "https";
import {IncomingMessage} from "http";
import {existsSync, mkdirSync, createWriteStream} from "fs";
import {join, parse} from "path";
import AdmZip = require("adm-zip");
import {log1, log2} from "../src/utils";
import {JSAML} from "@vlegm/utils";
import {DEFAULT_DEST, MANIFEST_PATH} from "../src/config";

const URL = 'https://api.github.com/repos/metamask/metamask-extension/releases';

interface MetamaskRelease {
  downloadUrl: string;
  filename: string;
  tag: string;
}

export async function fetchMetamask(userAgent: string = 'Mozilla/5.0', version = 'latest') {
  log1('Fetching metamask');
  const release = await getMetamaskRelease(userAgent, version);
  const zipPath = await downloadMetamask(release);
  const folderPath = await unzip(zipPath);
  await JSAML.save({
    latest: folderPath
  }, MANIFEST_PATH);
}

async function fetch(url: string): Promise<IncomingMessage> {
  return new Promise(async (resolve, reject) => {
    const req = get(url, (resp) => {
      if(resp.statusCode == 302) {
        try { return resolve(fetch(resp.headers.location)); }
        catch(e) { reject(e); }
      }

      return resolve(resp);
    });

    req.on('error', reject);
  })
}
async function unzip(filePath: string) {
  const parsed = parse(filePath);
  const folderPath = join(parsed.dir, parsed.name);

  if(existsSync(folderPath)) {
    return folderPath;
  }

  log2('Unzipping', parsed.name);
  const zip = new AdmZip(filePath);
  zip.extractAllTo(folderPath);
  return folderPath;
}

async function downloadMetamask(release:MetamaskRelease, dest:string = DEFAULT_DEST): Promise<string> {
  return new Promise(async (resolve) => {
    const filePath = join(dest, release.filename);

    if(existsSync(filePath)) {
      return resolve(filePath);
    }

    if(!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    log2('Downloading', release.downloadUrl);
    const file = createWriteStream(filePath);
    const resp = await fetch(release.downloadUrl);
    resp.pipe(file);
    resp.on('end', () => resolve(filePath));
  });
}



async function getMetamaskRelease(userAgent: string, version = 'latest'): Promise<MetamaskRelease> {
  log2('Fetching Releases', userAgent);
  return new Promise((resolve, reject) => {
    get(URL, {
      headers: {
        'User-Agent': userAgent
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const releases = JSON.parse(body);
        if(!Array.isArray(releases)) reject(new Error('Failed to download Metamask releases'));
        const release = releases.find((release) =>
          version === 'latest' ||
          release.name.includes(version) ||
          release.tag_name.includes(version)
        );

        if(!release) reject(new Error(`Failed to download release: ${version}`));
        const chromeVariant = release.assets.find((asset) => asset.name.includes('chrome'));

        if(!chromeVariant) reject(new Error(`Failed to find chrome variant release: ${version}`));
        return resolve({
          downloadUrl: chromeVariant.browser_download_url,
          filename: chromeVariant.name,
          tag: release.tag_name
        });
      });
    });
  });
}

fetchMetamask().then(() => log1('Done!'));
