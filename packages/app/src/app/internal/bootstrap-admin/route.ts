import config from '@payload-config';
import {getPayload} from 'payload';
import {z} from 'zod';

import {isInternalRequest} from '../_auth';

export const dynamic = 'force-dynamic';

const BootstrapAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request): Promise<Response> {
  if (!(await isInternalRequest(request))) {
    return Response.json({ok: false, error: 'unauthorized'}, {status: 401});
  }

  const parsed = BootstrapAdminSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ok: false, error: 'invalid payload'}, {status: 400});
  }

  const payload = await getPayload({config});
  const existing = await payload.find({collection: 'users', limit: 1});
  if (existing.totalDocs > 0) {
    return Response.json({ok: true, skipped: true});
  }

  await payload.create({
    collection: 'users',
    data: {
      email: parsed.data.email,
      password: parsed.data.password,
      name: 'Admin',
      roles: ['admin'],
    },
  });

  return Response.json({ok: true, created: true});
}
