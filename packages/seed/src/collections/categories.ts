import type {Category, CollectionEntry} from '../types';

const category = (
  group: Category['group'],
  slug: string,
  name: string,
  extra: {description?: string; order?: number} = {},
): CollectionEntry<Category> => ({
  kind: 'collection',
  slug: 'categories',
  key: slug,
  shared: {
    group,
    order: extra.order,
  },
  locales: {'zh-hans': {name, description: extra.description}},
});

export const categories: CollectionEntry<Category>[] = [
  category('blog', 'announcement', '公告', {order: 10}),
  category('blog', 'news', '新闻', {order: 20}),
  category('blog', 'event', '观摩推广', {order: 30}),
  category('blog', 'blog', '文章', {order: 40}),
  category('service', 'technical-guidance', '技术指导', {order: 10}),
  category('service', 'customer-service', '客户服务', {order: 20}),
  category('service', 'dealer-support', '渠道支持', {order: 30}),
  category('research', 'research-achievements', '科研成果', {
    description: '新品种选育、示范推广、观摩会与行业交流。',
    order: 10,
  }),
  category('research', 'applied-technology', '应用技术', {
    description: '面向经销商、零售商、农户的技术指导与服务体系。',
    order: 20,
  }),
  category('research', 'research-production', '科研生产', {
    description: '品种资源、材料创制、组合鉴定与比较试验等。',
    order: 30,
  }),
  category('research', 'credentials', '证书资质', {
    description: '品种审定、植物新品种权、专利、科技成果与公司荣誉。',
    order: 40,
  }),
  category('hr', 'jobs', '招聘职位', {
    description: '在招岗位与招聘说明。',
    order: 10,
  }),
];
