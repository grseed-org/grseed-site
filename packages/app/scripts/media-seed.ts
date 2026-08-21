import config from '@payload-config';
import {getPayload} from 'payload';

import {seedMediaAssets} from '../src/seed/media';

const run = async () => {
  const payload = await getPayload({config});
  await seedMediaAssets(payload);
};

await run();
process.exit(0);
