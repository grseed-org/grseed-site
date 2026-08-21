import type {CollectionEntry, Tag} from '../types';

// Shared semantic labels used by posts and products. Structural section filters
// live in categories. Tags use `kind` for semantic dimensions; do not reuse the
// category `group` term here because group means "owning route section".
const tag = (
  slug: string,
  kind: NonNullable<Tag['kind']>,
  name: string,
  extra: {
    description?: string;
    showInAbout?: boolean;
    aboutOrder?: number;
  } = {},
): CollectionEntry<Tag> => ({
  kind: 'collection',
  slug: 'tags',
  key: slug,
  shared: {
    kind,
    showInAbout: extra.showInAbout,
    aboutOrder: extra.aboutOrder,
  },
  locales: {'zh-hans': {name, description: extra.description}},
});

export const tags: CollectionEntry<Tag>[] = [
  tag('rice', 'crop', '水稻', {
    description: '覆盖中籼、两系杂交与粳糯等方向。',
    showInAbout: true,
    aboutOrder: 10,
  }),
  tag('wheat', 'crop', '小麦', {
    description: '以瑞晶麦等麦类品种为代表。',
    showInAbout: true,
    aboutOrder: 60,
  }),
  tag('rapeseed', 'crop', '油菜'),
  tag('cotton', 'crop', '棉花'),
  tag('two-line-hybrid', 'lineage', '两系杂交', {
    description: '两系杂交水稻品种。',
    showInAbout: true,
    aboutOrder: 20,
  }),
  tag('conventional-rice', 'lineage', '常规水稻', {
    showInAbout: true,
    aboutOrder: 30,
  }),
  tag('indica', 'lineage', '籼型'),
  tag('indica-japonica', 'lineage', '籼粳交', {
    description: '籼不粳恢，长粒偏籼型。',
    showInAbout: true,
    aboutOrder: 40,
  }),
  tag('japonica-glutinous', 'lineage', '粳糯'),
  tag('wheat-variety', 'lineage', '麦类品种'),
  tag('ruiliangyou-series', 'series', '瑞两优'),
  tag('daohai-series', 'series', '稻海'),
  tag('ruijing-series', 'series', '瑞晶'),
  tag('huiliangyou-series', 'series', '徽两优'),
  tag('liangyou-series', 'series', '两优'),
  tag('high-quality', 'trait', '优质'),
  tag('high-yield', 'trait', '高产'),
  tag('lodging-resistant', 'trait', '抗倒'),
  tag('heat-tolerant', 'trait', '耐热'),
  tag('disease-resistant', 'trait', '抗病'),
  tag('taste-quality', 'trait', '食味品质'),
  tag('yangtze-middle-lower', 'region', '长江中下游'),
  tag('anhui', 'region', '安徽'),
  tag('hubei', 'region', '湖北'),
  tag('wheat-stubble-rice-area', 'region', '麦茬稻区'),
  tag('winter-wheat-area', 'region', '冬麦区'),
];
