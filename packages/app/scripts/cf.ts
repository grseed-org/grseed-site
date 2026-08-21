import {spawn, type ChildProcess, type StdioOptions} from 'node:child_process';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const REPO_ROOT = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const APP_ROOT = resolve(REPO_ROOT, 'packages/app');
const ENV_PRODUCTION_PATH = resolve(APP_ROOT, '.env.production');

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
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

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function requireEnv(name: string): string {
  const value = env(name);
  if (!value) {
    console.error(`Missing required env ${name}.`);
    console.error(
      'Set it in the environment (CI secrets) or copy packages/app/.env.production.example to packages/app/.env.production.',
    );
    process.exit(1);
  }
  return value;
}

loadEnvFile(ENV_PRODUCTION_PATH);

const accountId = requireEnv('CLOUDFLARE_ACCOUNT_ID');
const payloadSecret = requireEnv('PAYLOAD_SECRET');
const apiToken = process.env.CI
  ? requireEnv('CLOUDFLARE_API_TOKEN')
  : env('CLOUDFLARE_API_TOKEN');

const sanitizedProcessEnv = {...process.env};
for (const key of [
  'http_proxy',
  'https_proxy',
  'all_proxy',
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'ALL_PROXY',
]) {
  delete sanitizedProcessEnv[key];
  delete process.env[key];
}

const baseEnv: Record<string, string | undefined> = {
  ...sanitizedProcessEnv,
  CLOUDFLARE_ACCOUNT_ID: accountId,
  CLOUDFLARE_ENV: 'production',
  NODE_ENV: 'production',
  PAYLOAD_SECRET: payloadSecret,
};

if (apiToken) {
  baseEnv.CLOUDFLARE_API_TOKEN = apiToken;
}

function spawnEnv(
  envVars: Record<string, string | undefined>,
): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(envVars).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  ) as NodeJS.ProcessEnv;
}

function waitForExit(proc: ChildProcess): Promise<number> {
  return new Promise((resolvePromise, reject) => {
    proc.on('error', reject);
    proc.on('exit', code => resolvePromise(code ?? 1));
  });
}

function packageBin(name: string) {
  const exe = process.platform === 'win32' ? `${name}.cmd` : name;
  const appPath = join(APP_ROOT, 'node_modules', '.bin', exe);
  if (existsSync(appPath)) return appPath;
  const rootPath = join(REPO_ROOT, 'node_modules', '.bin', exe);
  if (existsSync(rootPath)) return rootPath;
  throw new Error(`Cannot find ${name} binary`);
}

function spawnBin(
  name: string,
  args: string[],
  stdio: StdioOptions,
  envVars = baseEnv,
) {
  return spawn(packageBin(name), args, {
    cwd: APP_ROOT,
    env: spawnEnv(envVars),
    stdio,
    windowsHide: true,
    shell: process.platform === 'win32',
  });
}

async function run(
  name: string,
  args: string[],
  envVars: Record<string, string | undefined> = baseEnv,
) {
  console.log(`\n> ${name} ${args.join(' ')}`);
  const proc = spawnBin(name, args, 'inherit', envVars);
  const code = await waitForExit(proc);
  if (code !== 0) process.exit(code);
}

async function runCapture(
  name: string,
  args: string[],
  envVars: Record<string, string | undefined> = baseEnv,
) {
  console.log(`\n> ${name} ${args.join(' ')}`);
  const proc = spawnBin(name, args, ['ignore', 'pipe', 'inherit'], envVars);
  let output = '';
  proc.stdout?.setEncoding('utf8');
  proc.stdout?.on('data', chunk => {
    output += chunk;
  });
  const code = await waitForExit(proc);
  if (code !== 0) return undefined;
  return output;
}

async function runWithInput(name: string, args: string[], input: string) {
  console.log(`\n> ${name} ${args.join(' ')}`);
  const proc = spawnBin(name, args, ['pipe', 'inherit', 'inherit']);
  proc.stdin?.write(`${input}\n`);
  proc.stdin?.end();
  const code = await waitForExit(proc);
  if (code !== 0) process.exit(code);
}

async function putSecret() {
  await runWithInput(
    'wrangler',
    ['secret', 'put', 'PAYLOAD_SECRET', '--env=production'],
    payloadSecret,
  );
}

async function migrate() {
  const migrationsDir = resolve(APP_ROOT, 'src/migrations');
  const files = readdirSync(migrationsDir)
    .filter(file => /^\d+_\d+\.ts$/.test(file))
    .sort();

  if (files.length === 0) {
    console.log('No migrations found.');
    return;
  }

  const applied = new Set<string>();
  const appliedJson = await runCapture('wrangler', [
    'd1',
    'execute',
    'DB',
    '--command',
    'SELECT name FROM payload_migrations',
    '--env=production',
    '--remote',
    '--json',
  ]);
  if (appliedJson) {
    const parsed = JSON.parse(appliedJson) as Array<{
      results?: Array<{name?: string}>;
    }>;
    for (const row of parsed[0]?.results ?? []) {
      if (row.name) applied.add(row.name);
    }
  }

  const statements: string[] = [];
  for (const file of files) {
    const name = file.replace(/\.ts$/, '');
    if (applied.has(name)) {
      console.log(`Skipping applied migration ${name}.`);
      continue;
    }

    const source = readFileSync(resolve(migrationsDir, file), 'utf8');
    const up = source.match(
      /export async function up[\s\S]*?\{([\s\S]*?)\n\}\n\nexport async function down/,
    )?.[1];
    if (!up) throw new Error(`Could not find migration up() body in ${file}.`);

    for (const match of up.matchAll(
      /db\.run\(\s*sql`((?:\\`|[^`])*)`\s*,?\s*\)/g,
    )) {
      statements.push(
        match[1]
          .replaceAll('\\`', '`')
          .replace(/^CREATE TABLE `/, 'CREATE TABLE IF NOT EXISTS `')
          .replace(
            /^CREATE UNIQUE INDEX `/,
            'CREATE UNIQUE INDEX IF NOT EXISTS `',
          )
          .replace(/^CREATE INDEX `/, 'CREATE INDEX IF NOT EXISTS `')
          .trim(),
      );
    }
    statements.push(
      `INSERT INTO payload_migrations (name, batch)
       SELECT '${name}', 1
      WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '${name}');`,
    );
  }

  if (statements.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  const sqlPath = join(tmpdir(), 'grseed-d1-migrations.sql');
  writeFileSync(sqlPath, statements.join('\n\n') + '\n');
  await run('wrangler', [
    'd1',
    'execute',
    'DB',
    '--file',
    sqlPath,
    '--env=production',
    '--remote',
  ]);
  await run('wrangler', [
    'd1',
    'execute',
    'DB',
    '--command',
    'PRAGMA optimize',
    '--env=production',
    '--remote',
  ]);
}

async function bootstrapAdmin() {
  const url = new URL(
    '/internal/bootstrap-admin',
    requireEnv('CANONICAL_URL'),
  );
  console.log(`\n> POST ${url.toString()}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${payloadSecret}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: requireEnv('PAYLOAD_SEED_ADMIN_EMAIL'),
      password: requireEnv('PAYLOAD_SEED_ADMIN_PASSWORD'),
    }),
  });
  const body = await response.text();
  console.log(`${response.status} ${response.statusText}`);
  console.log(body);
  if (!response.ok) {
    throw new Error('admin bootstrap failed');
  }
}

async function seedProduction() {
  await run('tsx', ['scripts/seed.ts'], {
    ...baseEnv,
    PAYLOAD_SEED_ADMIN_EMAIL: requireEnv('PAYLOAD_SEED_ADMIN_EMAIL'),
    PAYLOAD_SEED_ADMIN_PASSWORD: requireEnv('PAYLOAD_SEED_ADMIN_PASSWORD'),
  });
}
async function mediaSeed() {
  await run('tsx', ['scripts/media-seed.ts']);
}
async function richtextMigrate() {
  const url = new URL('/internal/richtext-migrate', requireEnv('CANONICAL_URL'));
  console.log(`\n> POST ${url.toString()}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {authorization: `Bearer ${payloadSecret}`},
  });
  const body = await response.text();
  console.log(`${response.status} ${response.statusText}`);
  console.log(body);
  if (!response.ok) {
    throw new Error('rich text migration failed');
  }
}

async function deploy() {
  await run('payload', ['generate:importmap']);
  await run('wrangler', [
    'types',
    '--env-interface',
    'CloudflareEnv',
    'cloudflare-env.d.ts',
  ]);
  await run('payload', ['generate:types']);
  await run('opennextjs-cloudflare', ['build', '--env=production']);
  await deployBuilt();
}

async function deployBuilt() {
  await run('opennextjs-cloudflare', ['deploy', '--env=production']);
}

async function release() {
  await migrate();
  await deploy();
}
const command = process.argv[2];
const commands: Record<string, () => Promise<void>> = {
  'put-secret': putSecret,
  migrate,
  'bootstrap-admin': bootstrapAdmin,
  seed: seedProduction,
  'media-seed': mediaSeed,
  'richtext-migrate': richtextMigrate,
  deploy,
  'deploy-built': deployBuilt,
  release,
};

if (!command || !commands[command]) {
  console.error(
    `Usage: task <${['migrate', 'bootstrap-admin', 'seed', 'media-seed', 'richtext-migrate', 'put-secret', 'deploy', 'deploy-built', 'release'].join('|')}>`,
  );
  process.exit(1);
}

await commands[command]();
