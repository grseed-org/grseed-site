'use client';

import * as React from 'react';

import {useTranslations} from 'next-intl';
import {
  CheckCircle2,
  Copy,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';

import type {Contact as ContactContent} from '@/payload-types';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Separator} from '@/components/ui/separator';

// Stable keys for the copy-toast (chrome labels resolve via messages copyKind.*).
type CopyKind = 'mobile' | 'email' | 'address' | 'website';

async function copyToClipboard(text: string) {
  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function CopyRow({
  icon,
  label,
  value,
  kind,
  hint,
  onCopy,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  kind: CopyKind;
  hint?: string;
  onCopy: (kind: CopyKind, value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-auto w-full justify-between gap-3 whitespace-normal px-4 py-3 text-left"
        onClick={() => onCopy(kind, value)}
      >
        <div className="min-w-0">
          <div className="wrap-break-word text-sm font-semibold text-foreground">
            {value}
          </div>
          {hint ? (
            <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
          ) : null}
        </div>
        <Copy className="size-4 shrink-0 text-muted-foreground" />
      </Button>
    </div>
  );
}

export default function Contact({contact}: {contact: ContactContent}) {
  const t = useTranslations('Contact');
  const [copiedOpen, setCopiedOpen] = React.useState(false);
  const [copiedText, setCopiedText] = React.useState('');
  const [copiedKind, setCopiedKind] = React.useState<CopyKind>('mobile');

  const closeTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleCopy = React.useCallback(
    async (kind: CopyKind, value: string) => {
      const ok = await copyToClipboard(value);
      if (!ok) return;

      setCopiedKind(kind);
      setCopiedText(value);
      setCopiedOpen(true);

      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => {
        setCopiedOpen(false);
      }, 1200);
    },
    [],
  );

  const contacts = contact.contacts ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                <Users className="size-4 text-primary" />
                {sectionEyebrow(contact.sections, 'hero')}
              </div>

              <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {sectionHeading(contact.sections, 'hero')}
              </h1>
              <p className="mt-4 max-w-xl leading-7 text-foreground/90">
                {sectionBody(contact.sections, 'hero')}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Copy className="size-4" />
                  {t('badgeClickCopy')}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="size-4" />
                  {t('badgeToast')}
                </Badge>
              </div>
            </div>

            <div className="lg:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {sectionHeading(contact.sections, 'company-info')}
                  </CardTitle>
                  <CardDescription>
                    {sectionBody(contact.sections, 'company-info')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CopyRow
                    icon={<MapPin className="size-4" />}
                    label={t('addressLabel')}
                    value={contact.address ?? ''}
                    kind="address"
                    hint={t('addressHint')}
                    onCopy={handleCopy}
                  />
                  <CopyRow
                    icon={<Phone className="size-4" />}
                    label={t('phoneLabel')}
                    value={contact.phone ?? ''}
                    kind="mobile"
                    hint={t('phoneHint')}
                    onCopy={handleCopy}
                  />
                  <CopyRow
                    icon={<Mail className="size-4" />}
                    label={t('emailLabel')}
                    value={contact.email ?? ''}
                    kind="email"
                    hint={t('emailHint')}
                    onCopy={handleCopy}
                  />
                  <CopyRow
                    icon={<Globe className="size-4" />}
                    label={t('websiteLabel')}
                    value={contact.website ?? ''}
                    kind="website"
                    hint={t('websiteHint')}
                    onCopy={handleCopy}
                  />

                  <Separator />

                  <div className="text-sm text-muted-foreground">
                    {t('httpsTip')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-primary">
                {sectionEyebrow(contact.sections, 'contacts')}
              </div>
              <h2 className="mt-1 text-2xl font-bold">
                {sectionHeading(contact.sections, 'contacts')}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {sectionBody(contact.sections, 'contacts')}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((person, i) => (
              <Card
                key={person.id ?? i}
                className="cursor-pointer transition-colors hover:bg-muted/40"
                onClick={() => handleCopy('mobile', person.mobile ?? '')}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCopy('mobile', person.mobile ?? '');
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{person.name}</CardTitle>
                  <CardDescription>{person.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {t('mobileLabel')}
                      </div>
                      <div className="mt-0.5 break-all font-semibold">
                        {person.mobile}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Copy className="size-4" />
                      {t('copy')}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-auto w-full justify-between px-4 py-3"
                    onClick={e => {
                      e.stopPropagation();
                      handleCopy('mobile', person.mobile ?? '');
                    }}
                  >
                    <span className="text-sm">{t('copyMobile')}</span>
                    <Copy className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={copiedOpen} onOpenChange={({open}) => setCopiedOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('copiedTitle')}</DialogTitle>
            <DialogDescription>
              {t('copiedToast', {kind: t(`copyKind.${copiedKind}`)})}
              <span className="ml-1 break-all font-semibold text-foreground">
                {copiedText}
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
