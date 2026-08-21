import type {Hr as HrContent} from '@/payload-types';
import type {PostItem} from '@/lib/types';

import {HrFutureSection} from '@/components/HR/HrFutureSection';
import {HrHeroSection} from '@/components/HR/HrHeroSection';
import {HrJobsSection} from '@/components/HR/HrJobsSection';
import {HrPhilosophySection} from '@/components/HR/HrPhilosophySection';
import {HrValuesSection} from '@/components/HR/HrValuesSection';

// Server view: the `hr` global is fetched by the route and threaded into each
// section. Editorial copy comes from this prop; chrome from messages; icons/tones
// from src/data/hr-ui.ts. Open roles are independent posts in category group `hr`.
export default function Hr({hr, posts}: {hr: HrContent; posts: PostItem[]}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HrHeroSection hr={hr} />
      <HrJobsSection posts={posts} />
      <HrPhilosophySection hr={hr} />
      <HrValuesSection hr={hr} />
      <HrFutureSection hr={hr} />
    </main>
  );
}
