import {Building2, ShieldCheck, TrendingUp} from 'lucide-react';

// Presentation-only join for the About page: the editorial copy (milestone
// year/body, etc.) comes from the `about` global; the icons that decorate each
// milestone are layout, not content, so they stay in code and are joined to the
// global's `milestones` array by index. Keep this in the same order as
// @grseed/seed's about.milestones.
export const MILESTONE_ICONS = [Building2, TrendingUp, ShieldCheck] as const;
