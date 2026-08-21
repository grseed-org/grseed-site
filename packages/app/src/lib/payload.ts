import 'server-only';

import {getPayload, type Payload} from 'payload';

import config from '@payload-config';

// Frontend content reads go through Payload's Local API (in-process), never over
// HTTP — no network hop, no CORS, typed straight from payload-types. The GraphQL
// endpoint stays mounted for external consumers, but the app never calls it.
//
// The instance is cached at module scope so the whole server process shares one
// Payload (and one DB pool) across requests.
let cached: Promise<Payload> | null = null;

export function getPayloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({config});
  return cached;
}
