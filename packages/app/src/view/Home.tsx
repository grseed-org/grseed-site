import {
  ArrowRight,
  Award,
  Factory,
  FlaskConical,
  Handshake,
  Leaf,
  type LucideIcon,
  Microscope,
  ShieldCheck,
  Truck,
  Users,
  Warehouse,
} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {Link} from '@/i18n/navigation';
import type {CategoryItem, ProductItem} from '@/lib/types';
import type {Home as HomeContent} from '@/payload-types';
import {sectionBody, sectionEyebrow, sectionHeading} from '@/lib/sections';
import Hero from '@/components/Home/Hero';
import {HorizontalProductCarousel} from '@/components/Home/HorizontalProductCarousel';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

function SectionIntro({
  eyebrow,
  heading,
  body,
  className,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow ? (
        <div className="text-sm font-semibold text-primary">{eyebrow}</div>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold leading-tight tracking-normal text-foreground md:text-4xl">
        {heading}
      </h2>
      {body ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground">{body}</p>
      ) : null}
    </div>
  );
}

function IconFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
}

const strengthProofs = [
  {
    icon: Microscope,
    title: '专业研发团队',
    description: '围绕品种选育、材料创制和组合筛选持续投入。',
  },
  {
    icon: Warehouse,
    title: '科研与基地协同',
    description: '以试验示范和稳定制种基地支撑田间表现验证。',
  },
  {
    icon: Factory,
    title: '生产加工体系',
    description: '从繁育、加工、检验到仓储形成标准化流程。',
  },
] as const;

const servicePaths = [
  {
    icon: Handshake,
    title: '经销商合作',
    description: '重点品种、区域策略、市场活动与持续经营支持。',
  },
  {
    icon: Truck,
    title: '零售销售',
    description: '稳定供货、产品资料、门店推广和售后响应。',
  },
  {
    icon: Leaf,
    title: '农户用种',
    description: '品种选择、栽培建议、田间问题反馈和跟踪服务。',
  },
] as const;

const researchFallbacks = [
  {
    icon: Award,
    title: '品种审定',
    description: '国家与省级审定方向的成果沉淀。',
  },
  {
    icon: ShieldCheck,
    title: '知识产权',
    description: '植物新品种权、专利及相关技术权益。',
  },
  {
    icon: FlaskConical,
    title: '科技成果',
    description: '材料创制、组合鉴定与成果转化。',
  },
] as const;

// Server component: editorial copy (hero slogan/stats, company intro,
// advantages) comes from the `home` global; chrome from messages; product and
// research lists are passed from the data layer so the homepage stays CMS-driven.
export default function Home({
  home,
  productItems = [],
  researchCategories = [],
}: {
  home: HomeContent;
  productItems?: ProductItem[];
  researchCategories?: CategoryItem[];
}) {
  const tc = useTranslations('Common');
  const advantages = home.advantages ?? [];
  const stats = (home.achievements ?? []).map(a => ({
    label: a.label,
    value: a.value,
  }));
  const researchItems = researchCategories.length
    ? researchCategories.map((category, index) => ({
        href: `/pages/research?category=${category.slug}`,
        title: category.name,
        description: category.description ?? '',
        icon: researchFallbacks[index % researchFallbacks.length].icon,
      }))
    : researchFallbacks.map(item => ({
        href: '/pages/research',
        title: item.title,
        description: item.description,
        icon: item.icon,
      }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero
        slogan={home.title ?? ''}
        companyName={home.companyName ?? ''}
        tagline={home.summary ?? ''}
        stats={stats}
      />

      <section id="products" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionIntro
            eyebrow={sectionEyebrow(home.sections, 'products')}
            heading={sectionHeading(home.sections, 'products')}
            body="围绕水稻、小麦、油菜等主要作物，提供经过区域验证的品种组合与配套服务。"
          />
          <Link href="/product" className="shrink-0">
            <Button variant="outline">
              {tc('viewAll')}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10">
          <HorizontalProductCarousel
            productList={productItems.map(product => ({
              slug: product.slug,
              title: product.name,
              summary: product.description ?? '',
              tag: product.tags[0]?.name ?? '',
              coverUrl: product.coverUrl,
            }))}
          />
        </div>
      </section>

      <section id="about" className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionIntro
              eyebrow={sectionEyebrow(home.sections, 'company-intro')}
              heading={sectionHeading(home.sections, 'company-intro')}
              body={sectionBody(home.sections, 'company-intro')}
            />

            <div className="grid gap-5 md:grid-cols-2">
              {advantages.map((a, i) => (
                <IconFeature
                  key={a.id ?? i}
                  icon={strengthProofs[i % strengthProofs.length].icon}
                  title={a.title ?? ''}
                  description={a.description ?? ''}
                />
              ))}
              {strengthProofs.slice(advantages.length).map(item => (
                <IconFeature
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/pages/contact">
              <Button>{tc('getContact')}</Button>
            </Link>
            <Link href="/pages/research">
              <Button variant="outline">{tc('learnResearch')}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="research" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionIntro
              eyebrow={sectionEyebrow(home.sections, 'research')}
              heading={sectionHeading(home.sections, 'research')}
              body="把科研成果放到可检索、可追溯、可用于市场沟通的位置，而不是停留在空白展示框。"
            />
            <Link href="/pages/research" className="mt-7 inline-flex">
              <Button>
                {tc('learnResearch')}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 lg:col-span-7">
            {researchItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={`${item.href}:${item.title}`}
                  href={item.href}
                  className="group grid gap-4 rounded-lg border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/20 md:grid-cols-[auto_1fr_auto] md:items-center"
                >
                  <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description || '查看对应成果、证书与技术资料。'}
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="service"
        className="border-y bg-primary text-primary-foreground"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionIntro
              className="lg:col-span-7 [&_div]:text-primary-foreground/80 [&_h2]:text-primary-foreground [&_p]:text-primary-foreground/78"
              eyebrow={sectionEyebrow(home.sections, 'service')}
              heading={sectionHeading(home.sections, 'service')}
              body="把品种、渠道、技术和售后放在同一个服务闭环里，让合作方知道下一步该联系谁、解决什么问题。"
            />
            <div className="lg:col-span-5 lg:text-right">
              <Link href="/pages/contact">
                <Button variant="secondary" size="xl">
                  {tc('serviceHotline')}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {servicePaths.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-white/18 bg-white/10 p-6"
                >
                  <Icon className="size-7 text-white" />
                  <div className="mt-5 text-lg font-semibold">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-primary-foreground/78">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="hr" className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 rounded-lg border bg-card p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div className="flex gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-primary">
                {sectionEyebrow(home.sections, 'hr')}
              </div>
              <h2 className="mt-1 text-2xl font-bold leading-tight">
                {sectionHeading(home.sections, 'hr')}
              </h2>
            </div>
          </div>
          <Link href="/pages/hr">
            <Button variant="outline">
              {tc('learnMore')}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
