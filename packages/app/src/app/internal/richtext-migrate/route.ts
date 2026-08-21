import {getCloudflareContext} from '@opennextjs/cloudflare';
import config from '@payload-config';
import {getPayload, type Payload} from 'payload';

import {markdownToLexical} from '@/lib/richText';

import {isInternalRequest} from '../_auth';

export const dynamic = 'force-dynamic';

const targets = [
  {field: 'content', table: 'posts_locales'},
  {field: 'version_content', table: '_posts_v_locales'},
  {field: 'body', table: 'products_locales'},
  {field: 'version_body', table: '_products_v_locales'},
  {field: 'content', table: 'pages_locales'},
  {field: 'version_content', table: '_pages_v_locales'},
] as const;

type Target = (typeof targets)[number];
type MigrationRow = {
  id: number;
  _locale: string;
  value: string | null;
};
type D1BindValue = null | number | string;
type D1StatementLike = {
  all<T>(): Promise<{results?: T[]}>;
  bind(...values: D1BindValue[]): D1StatementLike;
  run(): Promise<unknown>;
};
type D1DatabaseLike = {
  prepare(query: string): D1StatementLike;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLexicalJSONString = (value: string): boolean => {
  try {
    const parsed = JSON.parse(value);
    return isRecord(parsed) && isRecord(parsed.root);
  } catch {
    return false;
  }
};

const quoteIdentifier = (identifier: string) => `\`${identifier}\``;

async function migrateTarget({
  db,
  field,
  payload,
  table,
}: {
  db: D1DatabaseLike;
  field: Target['field'];
  payload: Payload;
  table: Target['table'];
}) {
  const quotedField = quoteIdentifier(field);
  const quotedTable = quoteIdentifier(table);
  const result = await db
    .prepare(
      `SELECT id, _locale, ${quotedField} AS value
       FROM ${quotedTable}
       WHERE ${quotedField} IS NOT NULL`,
    )
    .all<MigrationRow>();

  let converted = 0;
  let skipped = 0;

  for (const row of result.results ?? []) {
    const value = row.value;
    if (typeof value !== 'string') {
      skipped += 1;
      continue;
    }
    if (isLexicalJSONString(value)) {
      skipped += 1;
      continue;
    }

    const nextValue = value.trim()
      ? JSON.stringify(markdownToLexical(payload, value))
      : null;

    await db
      .prepare(`UPDATE ${quotedTable} SET ${quotedField} = ? WHERE id = ?`)
      .bind(nextValue, row.id)
      .run();
    converted += 1;
  }

  return {
    converted,
    field,
    scanned: result.results?.length ?? 0,
    skipped,
    table,
  };
}

export async function POST(request: Request): Promise<Response> {
  if (!(await isInternalRequest(request))) {
    return Response.json({ok: false, error: 'unauthorized'}, {status: 401});
  }

  try {
    const cloudflare = await getCloudflareContext({async: true});
    const db = cloudflare.env.DB;
    if (!db) throw new Error('Cloudflare D1 binding "DB" is missing.');

    const payload = await getPayload({config});
    const results = [];

    for (const target of targets) {
      results.push(await migrateTarget({...target, db, payload}));
    }

    return Response.json({
      ok: true,
      results,
      totalConverted: results.reduce((sum, item) => sum + item.converted, 0),
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      {status: 500},
    );
  }
}
