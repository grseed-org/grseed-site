import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {
  getCloudflareContext,
  type CloudflareContext,
} from '@opennextjs/cloudflare';
import {sqliteD1Adapter} from '@payloadcms/db-d1-sqlite';
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical';
import {r2Storage} from '@payloadcms/storage-r2';
import {en} from '@payloadcms/translations/languages/en';
import {zh} from '@payloadcms/translations/languages/zh';
import {buildConfig} from 'payload';
import type {GetPlatformProxyOptions} from 'wrangler';

import {Media} from './src/collections/Media';
import {Pages} from './src/collections/Pages';
import {Categories} from './src/collections/Categories';
import {Credentials} from './src/collections/Credentials';
import {Posts} from './src/collections/Posts';
import {Products} from './src/collections/Products';
import {Tags} from './src/collections/Tags';
import {Users} from './src/collections/Users';
import {About} from './src/globals/About';
import {BlogIndex} from './src/globals/BlogIndex';
import {Contact} from './src/globals/Contact';
import {Home} from './src/globals/Home';
import {HR} from './src/globals/HR';
import {Navigation} from './src/globals/Navigation';
import {ProductIndex} from './src/globals/ProductIndex';
import {Research} from './src/globals/Research';
import {Service} from './src/globals/Service';
import {SiteSettings} from './src/globals/SiteSettings';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const realpath = (value: string) =>
  fs.existsSync(value) ? fs.realpathSync(value) : undefined;

const isPayloadCLI = process.argv.some(value =>
  realpath(value)?.endsWith(path.join('payload', 'bin.js')),
);
const isProduction = process.env.NODE_ENV === 'production';
const isCloudflareReleaseScript = process.env.CLOUDFLARE_ENV === 'production';

type LogPayload = object | string;
const createLog =
  (level: string, fn: typeof console.log) =>
  (objOrMsg: LogPayload, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({level, msg: objOrMsg}));
      return;
    }
    fn(JSON.stringify({level, ...objOrMsg, msg}));
  };

// Workers do not expose the same stdout/logger behavior as Node. Payload's
// Cloudflare template serializes logs so Worker log tailing stays readable.
const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
};

const cloudflare =
  isPayloadCLI || !isProduction || isCloudflareReleaseScript
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({async: true});

const db = cloudflare.env.DB;
const r2 = cloudflare.env.R2;
if (!db) throw new Error('Cloudflare D1 binding "DB" is missing.');
if (!r2) throw new Error('Cloudflare R2 binding "R2" is missing.');

const trustedOrigins = [
  'http://localhost:4007',
  'https://grseed.com',
  'https://www.grseed.com',
  'https://ahgrzy.com',
  'https://www.ahgrzy.com',
];

export default buildConfig({
  // Keep admin/API URLs relative. www.ahgrzy.com is a fronting CDN proxy for
  // this Worker, so a fixed serverURL would make its admin call grseed.com and
  // lose the browser's ahgrzy.com session cookie.
  serverURL: '',
  secret: process.env.PAYLOAD_SECRET || '',
  cors: trustedOrigins,
  csrf: trustedOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Admin-panel UI language (distinct axis from content localization above).
  // Simplified Chinese's translation pack is keyed 'zh' (NOT 'zh-hans'); this
  // site/content zh-hans ⇄ admin-UI zh mapping is deliberate.
  i18n: {
    supportedLanguages: {en, zh},
    fallbackLanguage: 'zh',
  },
  // CMS content localization. Codes are 'en' / 'zh-hans' (NOT 'zh' — that code
  // is reserved for the admin-UI language pack; see the i18n block).
  localization: {
    locales: [
      {label: 'English', code: 'en'},
      {label: '简体中文', code: 'zh-hans'},
    ],
    defaultLocale: 'zh-hans',
    fallback: true,
  },
  editor: lexicalEditor({
    features: ({defaultFeatures}) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      UploadFeature({
        enabledCollections: ['media'],
      }),
    ],
  }),
  collections: [
    Users,
    Media,
    Tags,
    Categories,
    Credentials,
    Posts,
    Products,
    Pages,
  ],
  globals: [
    Home,
    About,
    BlogIndex,
    ProductIndex,
    Research,
    Service,
    HR,
    Contact,
    Navigation,
    SiteSettings,
  ],
  db: sqliteD1Adapter({
    binding: db,
    // Schema changes are migration-owned. Payload's dev schema push conflicts
    // with D1 after migrations create indexes, so local API scripts must not push.
    push: false,
  }),
  logger: isProduction ? (cloudflareLogger as any) : undefined,
  plugins: [
    r2Storage({
      bucket: r2,
      collections: {media: true},
    }),
  ],
  // Generated types land in src so the public app can import them across the
  // workspace without circular coupling.
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'src/generated-schema.graphql'),
  },
});

// Local Payload CLI commands use Wrangler's platform proxy. In production mode
// this intentionally targets remote Cloudflare bindings, so migrations operate
// on the real D1/R2 resources instead of a local SQLite facsimile.
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(
    /* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`
  ).then(({getPlatformProxy}) =>
    getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      remoteBindings: isProduction,
    } satisfies GetPlatformProxyOptions),
  );
}
