// Look up a global's `sections` block by its stable `key` (see globals/_shared
// sectionsField). Components join prose blocks by key, never by array index, so
// reordering blocks in the admin panel can't silently swap which copy renders.
export function sectionBody(
  sections:
    | ({key?: string | null; body?: string | null} | null)[]
    | null
    | undefined,
  key: string,
): string {
  return sections?.find(s => s?.key === key)?.body ?? '';
}

export function sectionEyebrow(
  sections:
    | ({key?: string | null; eyebrow?: string | null} | null)[]
    | null
    | undefined,
  key: string,
): string {
  return sections?.find(s => s?.key === key)?.eyebrow ?? '';
}

export function sectionHeading(
  sections:
    | ({key?: string | null; heading?: string | null} | null)[]
    | null
    | undefined,
  key: string,
): string {
  return sections?.find(s => s?.key === key)?.heading ?? '';
}
