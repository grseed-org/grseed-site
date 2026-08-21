import type {Authoring, CollectionEntry, Product} from '../types';

const imageStub = 0 as any;

type ProductShared = Partial<Authoring<Product>> & {
  displayOrder?: number;
};

const fact = (
  group: NonNullable<NonNullable<Product['facts']>[number]>['group'],
  label: string,
  value: string,
) => ({group, label, value});

const refsFor = (
  tagKeys: string[],
  credentialKeys: string[] = [],
  galleryKeys: string[] = [],
): CollectionEntry<Product>['refs'] => {
  const refs: CollectionEntry<Product>['refs'] = {
    tags: {collection: 'tags', keys: tagKeys},
  };
  if (credentialKeys.length > 0) {
    refs.credentials = {collection: 'credentials', keys: credentialKeys};
  }
  galleryKeys.forEach((key, index) => {
    refs[`gallery.${index}.image`] = {
      collection: 'media',
      key,
      field: 'assetKey',
    };
  });
  return refs;
};

const product = (
  key: string,
  tagKeys: string[],
  credentialKeys: string[],
  galleryKeys: string[],
  shared: ProductShared,
  zh: Partial<Authoring<Product>>,
): CollectionEntry<Product> => ({
  kind: 'collection',
  slug: 'products',
  key,
  refs: refsFor(tagKeys, credentialKeys, galleryKeys),
  shared: {
    publishedAt: '2026-01-01',
    _status: 'published',
    ...shared,
  },
  locales: {'zh-hans': zh},
});

export const products: CollectionEntry<Product>[] = [
  product(
    'ruiliangyou9578',
    [
      'rice',
      'two-line-hybrid',
      'indica',
      'ruiliangyou-series',
      'high-quality',
      'high-yield',
      'yangtze-middle-lower',
    ],
    ['approval-ruiliangyou9578', 'tech-achievement-quality-high-yield-rice'],
    ['product-ruiliangyou9578-field'],
    {displayOrder: 10},
    {
      name: '瑞两优9578',
      description: '籼型两系杂交水稻品种，适宜在长江中下游一季中稻区推广。',
      body: '瑞两优9578突出优质、高产与综合抗性表现，是国瑞种业重点推广的两系杂交水稻品种之一。',
      facts: [
        fact('overview', '品种类型', '籼型两系杂交水稻'),
        fact('region', '适宜区域', '长江中下游作一季中稻种植'),
        fact('cultivation', '生育期', '全生育期约135.1天'),
        fact('resistance', '抗性表现', '中抗稻瘟病，中抗白叶枯病'),
        fact(
          'quality',
          '米质表现',
          '整精米率、垩白度、胶稠度等主要指标表现稳定',
        ),
      ],
      gallery: [{image: imageStub, caption: '瑞两优9578田间表现'}],
    },
  ),
  product(
    'ruiliangyou1578',
    [
      'rice',
      'two-line-hybrid',
      'indica',
      'ruiliangyou-series',
      'high-quality',
      'high-yield',
      'yangtze-middle-lower',
    ],
    ['approval-ruiliangyou1578'],
    ['product-ruiliangyou1578-field'],
    {displayOrder: 20},
    {
      name: '瑞两优1578',
      description: '籼型两系杂交水稻品种，长江中下游一季中稻区重点品种。',
      body: '瑞两优1578兼顾产量、熟期与米质表现，适合作为国瑞水稻产品体系中的核心国审品种展示。',
      facts: [
        fact('overview', '品种类型', '籼型两系杂交水稻'),
        fact('cultivation', '生育期', '全生育期约130.1天'),
        fact('yield', '产量表现', '区域试验中表现出稳定增产潜力'),
        fact(
          'quality',
          '米质表现',
          '整精米率、垩白度、直链淀粉含量等指标表现较好',
        ),
        fact('resistance', '抗性提示', '需结合当地病虫害发生情况做好综合防治'),
      ],
      gallery: [{image: imageStub, caption: '瑞两优1578田间表现'}],
    },
  ),
  product(
    'ruiliangyou653',
    [
      'rice',
      'two-line-hybrid',
      'indica',
      'ruiliangyou-series',
      'high-yield',
      'lodging-resistant',
      'anhui',
    ],
    ['approval-ruiliangyou653', 'variety-right-ruiliangyou653'],
    ['product-ruiliangyou653-field-1', 'product-ruiliangyou653-field-2'],
    {displayOrder: 30},
    {
      name: '瑞两优653',
      description: '两系杂交水稻品种，具备稳定产量表现和示范推广基础。',
      body: '瑞两优653是国瑞种业重点示范推广品种，适合在区域观摩、渠道推广和产品中心中重点呈现。',
      facts: [
        fact('overview', '品种类型', '两系杂交水稻'),
        fact('yield', '产量表现', '区域试验平均亩产表现稳定，具有增产潜力'),
        fact('region', '推广区域', '安徽及周边适宜稻区'),
        fact('cultivation', '推广基础', '已有观摩会和示范推广素材支撑'),
      ],
      gallery: [
        {image: imageStub, caption: '瑞两优653田间表现'},
        {image: imageStub, caption: '瑞两优653稻田展示'},
      ],
    },
  ),
  product(
    'huiliangyou899',
    [
      'rice',
      'two-line-hybrid',
      'indica',
      'huiliangyou-series',
      'high-yield',
      'anhui',
    ],
    ['approval-huiliangyou899'],
    [],
    {displayOrder: 40},
    {
      name: '徽两优899',
      description: '徽两优系列两系杂交水稻品种。',
      body: '徽两优899是公司科研成果与品种审定体系中的代表品种之一。',
      facts: [
        fact('overview', '品种类型', '两系杂交水稻'),
        fact('yield', '产量表现', '区域试验表现稳定'),
      ],
    },
  ),
  product(
    'liangyou1598',
    ['rice', 'two-line-hybrid', 'indica', 'liangyou-series', 'high-quality'],
    ['approval-liangyou1598'],
    ['product-liangyou1598-field-1', 'product-liangyou1598-field-2'],
    {displayOrder: 50},
    {
      name: '两优1598',
      description: '两优系列杂交水稻品种，具备审定证书和田间展示素材。',
      body: '两优1598是国瑞种业产品矩阵中的两优系列品种，适合作为产品中心和科研成果联动展示。',
      facts: [
        fact('overview', '品种类型', '两系杂交水稻'),
        fact('quality', '产品定位', '优质、稳产型推广品种'),
      ],
      gallery: [
        {image: imageStub, caption: '两优1598田间表现'},
        {image: imageStub, caption: '两优1598植株与稻穗'},
      ],
    },
  ),
  product(
    'liangyou7871',
    ['rice', 'two-line-hybrid', 'liangyou-series'],
    ['approval-liangyou7871'],
    [],
    {displayOrder: 60},
    {
      name: '两优7871',
      description: '两优系列水稻品种。',
      facts: [fact('overview', '品种类型', '两系杂交水稻')],
    },
  ),
  product(
    'liangyou8876',
    ['rice', 'two-line-hybrid', 'liangyou-series', 'daohai-series'],
    ['approval-liangyou8876'],
    ['product-liangyou8876-field'],
    {displayOrder: 70},
    {
      name: '两优8876',
      description: '商品名稻海之星，稻海系列推广品种。',
      body: '两优8876以“稻海之星”作为市场展示名进入国瑞产品体系。',
      facts: [
        fact('overview', '商品名', '稻海之星'),
        fact('overview', '品种类型', '两系杂交水稻'),
      ],
      gallery: [{image: imageStub, caption: '稻海之星（瑞两优8876）田间表现'}],
    },
  ),
  product(
    'ruiliangyou088',
    [
      'rice',
      'two-line-hybrid',
      'ruiliangyou-series',
      'daohai-series',
      'taste-quality',
      'hubei',
    ],
    ['approval-ruiliangyou088', 'award-ruiliangyou088-taste'],
    [
      'product-ruiliangyou088-field-1',
      'product-ruiliangyou088-field-2',
      'product-ruiliangyou088-field-3',
    ],
    {displayOrder: 80},
    {
      name: '瑞两优088',
      description: '商品名稻海龙珠，兼具品种审定与食味品质获奖素材。',
      body: '瑞两优088以“稻海龙珠”作为市场展示名，是国瑞种业观摩推广和品质展示的重要品种。',
      facts: [
        fact('overview', '商品名', '稻海龙珠'),
        fact('overview', '品种类型', '中籼两系杂交水稻'),
        fact('cultivation', '生育期', '全生育期约134.1天'),
        fact('quality', '品质荣誉', '获食味品质金奖'),
      ],
      gallery: [
        {image: imageStub, caption: '稻海龙珠田间表现'},
        {image: imageStub, caption: '稻海龙珠稻田展示'},
        {image: imageStub, caption: '稻海龙珠植株与稻穗'},
      ],
    },
  ),
  product(
    'ruiliangyou851',
    ['rice', 'two-line-hybrid', 'ruiliangyou-series', 'high-quality'],
    ['approval-ruiliangyou851'],
    ['product-ruiliangyou851-field-1', 'product-ruiliangyou851-field-2'],
    {displayOrder: 90},
    {
      name: '瑞两优851',
      description: '中籼两系杂交水稻品种。',
      facts: [
        fact('overview', '品种类型', '中籼两系杂交水稻'),
        fact('cultivation', '生育期', '全生育期约133.5天'),
      ],
      gallery: [
        {image: imageStub, caption: '瑞两优851田间表现'},
        {image: imageStub, caption: '瑞两优851植株与稻穗'},
      ],
    },
  ),
  product(
    'ruiliangyousimiao',
    ['rice', 'two-line-hybrid', 'ruiliangyou-series', 'high-quality'],
    ['approval-ruiliangyousimiao'],
    ['product-ruiliangyousimiao-field'],
    {displayOrder: 100},
    {
      name: '瑞两优丝苗',
      description: '丝苗型优质水稻品种。',
      facts: [
        fact('overview', '品种类型', '两系杂交水稻'),
        fact('quality', '产品定位', '丝苗型优质品种'),
      ],
      gallery: [{image: imageStub, caption: '瑞两优丝苗田间表现'}],
    },
  ),
  product(
    'ruiliangyou516',
    [
      'rice',
      'two-line-hybrid',
      'ruiliangyou-series',
      'ruijing-series',
      'taste-quality',
    ],
    ['approval-ruiliangyou516', 'award-ruiliangyou516-taste'],
    ['product-ruiliangyou516-field-1', 'product-ruiliangyou516-field-2'],
    {displayOrder: 110},
    {
      name: '瑞两优516',
      description: '商品名瑞晶香占，具备食味品质获奖素材。',
      body: '瑞两优516以“瑞晶香占”作为市场展示名，突出优质食味和推广价值。',
      facts: [
        fact('overview', '商品名', '瑞晶香占'),
        fact('overview', '品种类型', '两系杂交水稻'),
        fact('quality', '品质荣誉', '获食味品质金奖'),
      ],
      gallery: [
        {image: imageStub, caption: '瑞晶香占田间表现'},
        {image: imageStub, caption: '瑞晶香占稻田展示'},
      ],
    },
  ),
  product(
    'ruiliangyou1576',
    ['rice', 'two-line-hybrid', 'ruiliangyou-series'],
    ['approval-ruiliangyou1576'],
    [],
    {displayOrder: 120},
    {name: '瑞两优1576', description: '瑞两优系列水稻品种。'},
  ),
  product(
    'liangyou9526',
    ['rice', 'two-line-hybrid', 'liangyou-series'],
    ['approval-liangyou9526'],
    [],
    {displayOrder: 130},
    {name: '两优9526', description: '两优系列水稻品种。'},
  ),
  product(
    'liangyou669',
    ['rice', 'two-line-hybrid', 'liangyou-series'],
    [],
    [],
    {displayOrder: 140},
    {name: '两优669', description: '公司承担农业科技成果转化项目相关品种。'},
  ),
  product(
    'liangyou992',
    ['rice', 'two-line-hybrid', 'liangyou-series'],
    ['approval-liangyou992'],
    [],
    {displayOrder: 150},
    {name: '两优992', description: '两优系列水稻品种。'},
  ),
  product(
    'xuanjingnuo1',
    ['rice', 'conventional-rice', 'japonica-glutinous'],
    [],
    [],
    {displayOrder: 160},
    {name: '宣粳糯1号', description: '常规粳糯水稻品种。'},
  ),
  product(
    'dangjing8',
    ['rice', 'conventional-rice'],
    [],
    [],
    {displayOrder: 170},
    {name: '当粳8号', description: '常规水稻品种。'},
  ),
  product(
    'zaoxian108',
    ['rice', 'conventional-rice', 'indica'],
    ['approval-zaoxian108'],
    [],
    {displayOrder: 180},
    {name: '早籼108', description: '常规早籼水稻品种。'},
  ),
  product(
    'ruijingmai8441',
    ['wheat', 'wheat-variety', 'ruijing-series', 'winter-wheat-area'],
    ['approval-ruijingmai8441'],
    [],
    {displayOrder: 210},
    {
      name: '瑞晶麦8441',
      description: '白麦类型小麦品种。',
      facts: [fact('overview', '品种类型', '小麦品种')],
    },
  ),
  product(
    'ruiyou12',
    ['rapeseed'],
    [],
    [],
    {displayOrder: 220},
    {name: '瑞油12', description: '油菜品种。'},
  ),
  product(
    'guoruimian341',
    ['cotton'],
    ['approval-guoruimian341'],
    [],
    {displayOrder: 230},
    {name: '国瑞棉341', description: '棉花品种。'},
  ),
  product(
    'guoruimian8',
    ['cotton'],
    ['approval-guoruimian8'],
    [],
    {displayOrder: 240},
    {name: '国瑞棉8号', description: '棉花品种。'},
  ),
];
