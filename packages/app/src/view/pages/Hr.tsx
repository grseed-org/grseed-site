import type {Hr as HrContent} from '@/payload-types';

import {HrHeroSection} from '@/components/HR/HrHeroSection';
import {HrPhilosophySection} from '@/components/HR/HrPhilosophySection';
import {HrValuesSection} from '@/components/HR/HrValuesSection';
import {HrFutureSection} from '@/components/HR/HrFutureSection';

// Server view: the `hr` global is fetched by the route and threaded into each
// section. Editorial copy comes from this prop; chrome from messages; icons/tones
// from src/data/hr-ui.ts.
export default function Hr({hr}: {hr: HrContent}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HrHeroSection hr={hr} />
      <HrPhilosophySection hr={hr} />
      <HrValuesSection hr={hr} />
      <HrFutureSection hr={hr} />
    </main>
  );
}
