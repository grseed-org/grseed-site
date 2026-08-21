import 'server-only';

import {z} from 'zod';

// Server-only env. D1/R2 are Cloudflare bindings, not process env strings.
const schema = z.object({
  PAYLOAD_SECRET: z.string().min(1),
  PAYLOAD_LOG_LEVEL: z.string().optional(),
});

export const env = schema.parse(process.env);
