import {spawn, type ChildProcess, type StdioOptions} from 'node:child_process';
import {copyFileSync, existsSync, readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const APP_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const ENV_PATH = join(APP_ROOT, '.env');
const ENV_EXAMPLE_PATH = join(APP_ROOT, '.env.example');

type D1Like = {
  prepare: (query: string) => {first: () => Promise<unknown>};
};

type LocalBindings = {
  DB?: D1Like;
  R2?: unknown;
};

function loadEnvFile(path: string) {
  const source = readFileSync(path, 'utf8');
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function ensureEnvFile() {
  if (existsSync(ENV_PATH)) return false;
  if (!existsSync(ENV_EXAMPLE_PATH)) {
    throw new Error(`Missing ${ENV_EXAMPLE_PATH}; cannot create local .env.`);
  }
  copyFileSync(ENV_EXAMPLE_PATH, ENV_PATH);
  return true;
}

function packageBin(name: string) {
  const exe = process.platform === 'win32' ? `${name}.cmd` : name;
  const appPath = join(APP_ROOT, 'node_modules', '.bin', exe);
  if (existsSync(appPath)) return appPath;
  const rootPath = join(APP_ROOT, '../../node_modules', '.bin', exe);
  if (existsSync(rootPath)) return resolve(rootPath);
  throw new Error(`Cannot find ${name} binary`);
}

function waitForExit(proc: ChildProcess): Promise<number> {
  return new Promise((resolvePromise, reject) => {
    proc.on('error', reject);
    proc.on('exit', code => resolvePromise(code ?? 1));
  });
}

async function run(name: string, args: string[], stdio: StdioOptions = 'inherit') {
  const proc = spawn(packageBin(name), args, {
    cwd: APP_ROOT,
    env: process.env,
    stdio,
    windowsHide: true,
    shell: process.platform === 'win32',
  });
  const code = await waitForExit(proc);
  if (code !== 0) process.exit(code);
}

async function localD1HasSchema(db: D1Like): Promise<boolean> {
  try {
    const row = await db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='payload_migrations' LIMIT 1",
      )
      .first();
    return Boolean(row);
  } catch {
    return false;
  }
}

async function main() {
  process.chdir(APP_ROOT);

  const createdEnv = ensureEnvFile();
  if (createdEnv) console.log('[local:setup] created packages/app/.env from .env.example');
  loadEnvFile(ENV_PATH);

  const {getPlatformProxy} = await import('wrangler');
  const proxy = await getPlatformProxy({persist: true});
  const env = proxy.env as LocalBindings;
  if (!env.DB) throw new Error('Cloudflare D1 binding "DB" is missing.');
  if (!env.R2) throw new Error('Cloudflare R2 binding "R2" is missing.');

  const migrated = await localD1HasSchema(env.DB);
  await proxy.dispose();

  if (migrated) {
    console.log('[local:setup] local Wrangler D1 already has Payload migrations');
    return;
  }

  console.log('[local:setup] applying Payload migrations to local D1');
  await run('payload', ['migrate']);
  console.log('[local:setup] local Cloudflare D1/R2 is ready');
}

await main();
