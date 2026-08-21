import type {About as AboutContent} from '@/payload-types';
import type {AboutDerived} from '@/lib/about';

import {AboutHeroSection} from '@/components/About/AboutHeroSection';
import {ApprovalsSection} from '@/components/About/ApprovalsSection';
import {CompanyIntroSection} from '@/components/About/CompanyIntroSection';
import {FutureSection} from '@/components/About/FutureSection';
import {MainProductsSection} from '@/components/About/MainProducts';
import {ResearchBaseSection} from '@/components/About/ResearchBaseSection';

// Server view: the `about` global is fetched by the route and threaded into each
// section. Editorial copy comes from this prop; chrome from messages; icons/tones
// from src/data/about-ui.ts.
export default function About({
  about,
  derived,
}: {
  about: AboutContent;
  derived: AboutDerived;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AboutHeroSection about={about} stats={derived.stats} />
      <CompanyIntroSection about={about} />
      <MainProductsSection about={about} groups={derived.productGroups} />
      <ApprovalsSection about={about} approvals={derived.approvals} />
      <ResearchBaseSection about={about} stats={derived.stats} />
      <FutureSection about={about} />
    </main>
  );
}
