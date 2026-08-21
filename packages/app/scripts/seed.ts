import config from '@payload-config';
import {seedAll} from '@grseed/seed';
import {getPayload} from 'payload';

import {seedMediaAssets} from '../src/seed/media';

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for local seed.`);
  return value;
};

const run = async () => {
  const payload = await getPayload({config});
  const existing = await payload.find({collection: 'users', limit: 1});

  if (existing.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: getRequiredEnv('PAYLOAD_SEED_ADMIN_EMAIL'),
        password: getRequiredEnv('PAYLOAD_SEED_ADMIN_PASSWORD'),
        name: 'Admin',
        roles: ['admin'],
      },
    });
    payload.logger.info('[seed] created local admin');
  } else {
    payload.logger.info('[seed] skipped local admin (user exists)');
  }

  await seedMediaAssets(payload);
  await seedAll(payload);
  payload.logger.info('[seed] local seed complete');
};

await run();
process.exit(0);
