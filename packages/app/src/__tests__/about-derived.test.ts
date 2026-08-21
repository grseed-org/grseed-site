import {describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn(),
}));

import {deriveAboutContent} from '@/lib/about';

const tag = (
  slug: string,
  name: string,
  order: number,
  description?: string,
) => ({
  id: order,
  slug,
  name,
  kind: 'crop' as const,
  showInAbout: true,
  aboutOrder: order,
  description,
  updatedAt: '',
  createdAt: '',
});

const product = (
  id: number,
  name: string,
  slug: string,
  tags: ReturnType<typeof tag>[],
  structuredLevels: Array<'national' | 'provincial' | 'trial'> = [],
  displayOrder = id,
) => ({
  id,
  name,
  slug,
  tags,
  credentials: structuredLevels.map((level, index) => ({
    id: id * 10 + index,
    slug: `${slug}-${level}`,
    title: `${name}${level}`,
    type: 'approval' as const,
    level,
    updatedAt: '',
    createdAt: '',
  })),
  displayOrder,
  updatedAt: '',
  createdAt: '',
});

describe('deriveAboutContent', () => {
  it('groups About products by product tags marked for About display', () => {
    const rice = tag('rice', '水稻', 10, '水稻说明');
    const jietian = tag('jietian-rice', '杰田稻', 20);
    const hidden = {...tag('product', '产品', 0), showInAbout: false};

    const about = deriveAboutContent([
      product(2, '田中豪洁', 'tianzhonghaojie', [hidden, jietian]),
      product(1, '瑞两优9578', 'ruiliangyou9578', [hidden, rice], ['national']),
    ]);

    expect(about.productGroups).toEqual([
      {
        slug: 'rice',
        title: '水稻',
        description: '水稻说明',
        order: 10,
        varieties: [{id: '1', slug: 'ruiliangyou9578', name: '瑞两优9578'}],
      },
      {
        slug: 'jietian-rice',
        title: '杰田稻',
        description: undefined,
        order: 20,
        varieties: [{id: '2', slug: 'tianzhonghaojie', name: '田中豪洁'}],
      },
    ]);
  });

  it('derives approval lists and headline stats from products', () => {
    const rice = tag('rice', '水稻', 10);
    const about = deriveAboutContent([
      product(1, '瑞两优9578', 'ruiliangyou9578', [rice], ['national']),
      product(2, '两优1598', 'liangyou1598', [rice], ['provincial']),
      product(3, '试验品种', 'trial', [rice], ['trial']),
    ]);

    expect(about.approvals.national.map(p => p.name)).toEqual(['瑞两优9578']);
    expect(about.approvals.provincial.map(p => p.name)).toEqual(['两优1598']);
    expect(about.approvals.trial.map(p => p.name)).toEqual(['试验品种']);
    expect(about.stats).toEqual([
      {key: 'products', value: '3'},
      {key: 'groups', value: '1'},
      {key: 'national', value: '1'},
      {key: 'provincial', value: '1'},
    ]);
  });
});
