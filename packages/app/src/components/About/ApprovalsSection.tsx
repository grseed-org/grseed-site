import {Beaker, CheckCircle2, FlaskConical, TrendingUp} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {About} from '@/payload-types';
import type {AboutApprovals} from '@/lib/about';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import {Badge} from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ApprovalList({
  items,
  emptyLabel,
}: {
  items: Array<{id: string; name: string}>;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">{emptyLabel}</div>;
  }
  return (
    <>
      {items.map(v => (
        <div key={v.id} className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="size-4 text-primary" />
          {v.name}
        </div>
      ))}
    </>
  );
}

export function ApprovalsSection({
  about,
  approvals,
}: {
  about: About;
  approvals: AboutApprovals;
}) {
  const t = useTranslations('About');
  const tc = useTranslations('Common');
  const {national, provincial, trial} = approvals;

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="text-sm font-semibold text-primary">
              {sectionEyebrow(about.sections, 'approvals')}
            </div>
            <h2 className="mt-1 text-2xl font-bold">
              {sectionHeading(about.sections, 'approvals')}
            </h2>
            <p className="mt-4 leading-7 text-foreground/90">
              {sectionBody(about.sections, 'approvals')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-1">
                <Beaker className="size-4" />
                {t('approvalsNationalBadge', {count: national.length})}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <FlaskConical className="size-4" />
                {t('approvalsProvincialBadge', {
                  count: provincial.length,
                })}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="size-4" />
                {t('approvalsTrialBadge', {
                  count: trial.length,
                })}
              </Badge>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('approvalsNationalCard')}
                  </CardTitle>
                  <CardDescription>
                    {t('approvalsNationalCardDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <ApprovalList items={national} emptyLabel={tc('empty')} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('approvalsProvincialCard')}
                  </CardTitle>
                  <CardDescription>
                    {t('approvalsProvincialCardDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <ApprovalList items={provincial} emptyLabel={tc('empty')} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('approvalsTrialCard')}
                  </CardTitle>
                  <CardDescription>
                    {t('approvalsTrialCardDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <ApprovalList items={trial} emptyLabel={tc('empty')} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
