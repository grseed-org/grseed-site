import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  HeartHandshake,
  Lightbulb,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

// Presentation-only joins for the HR page. Editorial copy (philosophy values,
// highlights, journey steps) comes from the `hr` global; the icon + tone that
// decorate each item are layout, not content, so they stay in code and are
// joined to the global arrays BY INDEX. Each array below must stay in the same
// order as its @grseed/seed counterpart (hr.sections values / hr.highlights
// / hr.journey).

type Tone = 'primary' | 'secondary';

// One per philosophy value (the keyless hr.sections entries), in order.
export const VALUE_DECOR: {icon: LucideIcon; tone: Tone}[] = [
  {icon: Target, tone: 'primary'},
  {icon: Users, tone: 'secondary'},
  {icon: Sparkles, tone: 'secondary'},
  {icon: Lightbulb, tone: 'secondary'},
  {icon: BookOpen, tone: 'primary'},
];

// One per hr.highlights entry, in order.
export const HIGHLIGHT_ICONS: LucideIcon[] = [Target, BookOpen, HeartHandshake];

// One per hr.journey entry, in order.
export const JOURNEY_ICONS: LucideIcon[] = [
  Award,
  Users,
  BookOpen,
  BriefcaseBusiness,
];
