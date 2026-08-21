import type {CollectionEntry, Credential} from '../types';

const imageStub = 0 as any;

type CredentialShared = Partial<Credential> & {
  type: Credential['type'];
  level?: Credential['level'];
  displayOrder?: number;
};

const credential = (
  key: string,
  shared: CredentialShared,
  zh: Partial<Credential>,
  refs: CollectionEntry<Credential>['refs'] = {},
): CollectionEntry<Credential> => ({
  kind: 'collection',
  slug: 'credentials',
  key,
  refs,
  shared: {
    _status: 'published',
    publishedAt: '2026-01-01',
    ...shared,
  },
  locales: {'zh-hans': zh},
});

const documentRef = (assetKey: string) => ({
  'documentImages.0.image': {
    collection: 'media' as const,
    key: assetKey,
    field: 'assetKey',
  },
});

const approval = (
  key: string,
  title: string,
  assetKey: string,
  displayOrder: number,
  level: Credential['level'] = 'provincial',
) =>
  credential(
    key,
    {type: 'approval', level, year: '2020', displayOrder},
    {
      title,
      summary: `${title}，用于产品详情与科研成果资质展示。`,
      documentImages: [{image: imageStub, caption: title}],
    },
    documentRef(assetKey),
  );

export const credentials: CollectionEntry<Credential>[] = [
  credential(
    'honor-high-tech-2024',
    {type: 'award', level: 'national', year: '2024', displayOrder: 10},
    {
      title: '高新技术企业证书',
      summary: '安徽国瑞种业有限公司获评国家高新技术企业。',
      documentImages: [{image: imageStub, caption: '高新技术企业证书'}],
    },
    documentRef('honor-high-tech-2024'),
  ),
  credential(
    'honor-leading-enterprise',
    {type: 'award', level: 'municipal', displayOrder: 20},
    {
      title: '农业产业化龙头企业',
      summary: '公司农业产业化经营与推广服务能力的荣誉证明。',
      documentImages: [{image: imageStub, caption: '农业产业化龙头企业证书'}],
    },
    documentRef('honor-leading-enterprise'),
  ),
  credential(
    'honor-hefei-demo-consortium-2022',
    {type: 'award', level: 'municipal', year: '2022', displayOrder: 30},
    {
      title: '合肥市示范现代农业产业化联合体',
      summary: '2022年度合肥市示范现代农业产业化联合体荣誉。',
      documentImages: [
        {image: imageStub, caption: '合肥市示范现代农业产业化联合体证书'},
      ],
    },
    documentRef('honor-hefei-demo-consortium-2022'),
  ),
  credential(
    'award-ruiliangyou088-taste',
    {type: 'award', year: '2024', displayOrder: 40},
    {
      title: '瑞两优088食味品质金奖',
      summary: '瑞两优088在食味品质评价中获得金奖。',
      documentImages: [{image: imageStub, caption: '瑞两优088食味品质金奖'}],
    },
    documentRef('honor-ruiliangyou088-taste-award'),
  ),
  credential(
    'award-ruiliangyou516-taste',
    {type: 'award', year: '2024', displayOrder: 50},
    {
      title: '瑞两优516食味品质金奖',
      summary: '瑞两优516在食味品质评价中获得金奖。',
      documentImages: [{image: imageStub, caption: '瑞两优516食味品质金奖'}],
    },
    documentRef('honor-ruiliangyou516-taste-award'),
  ),
  approval(
    'approval-ruiliangyou9578',
    '瑞两优9578审定证书',
    'approval-ruiliangyou9578',
    100,
    'national',
  ),
  approval(
    'approval-ruiliangyou1578',
    '瑞两优1578审定证书',
    'approval-ruiliangyou1578',
    110,
    'national',
  ),
  approval(
    'approval-ruiliangyou653',
    '瑞两优653审定证书',
    'approval-ruiliangyou653',
    120,
    'national',
  ),
  approval(
    'approval-liangyou1598',
    '两优1598审定证书',
    'approval-liangyou1598',
    130,
    'provincial',
  ),
  approval(
    'approval-huiliangyou899',
    '徽两优899审定证书',
    'approval-huiliangyou899',
    140,
    'provincial',
  ),
  approval(
    'approval-liangyou7871',
    '两优7871审定证书',
    'approval-liangyou7871',
    150,
  ),
  approval(
    'approval-liangyou8876',
    '两优8876审定证书',
    'approval-liangyou8876',
    160,
  ),
  approval(
    'approval-ruiliangyou088',
    '瑞两优088审定证书',
    'approval-ruiliangyou088',
    170,
    'provincial',
  ),
  approval(
    'approval-ruiliangyou851',
    '瑞两优851审定证书',
    'approval-ruiliangyou851',
    180,
    'provincial',
  ),
  approval(
    'approval-ruiliangyousimiao',
    '瑞两优丝苗审定证书',
    'approval-ruiliangyousimiao',
    190,
    'provincial',
  ),
  approval(
    'approval-ruiliangyou516',
    '瑞两优516审定证书',
    'approval-ruiliangyou516',
    200,
    'provincial',
  ),
  approval(
    'approval-ruijingmai8441',
    '瑞晶麦8441审定证书',
    'approval-ruijingmai8441',
    210,
  ),
  approval(
    'approval-ruiliangyou1576',
    '瑞两优1576审定证书',
    'approval-ruiliangyou1576',
    220,
  ),
  approval(
    'approval-liangyou9526',
    '两优9526审定证书',
    'approval-liangyou9526',
    230,
  ),
  approval(
    'approval-liangyou992',
    '两优992审定证书',
    'approval-liangyou992',
    240,
  ),
  approval(
    'approval-zaoxian108',
    '早籼108审定证书',
    'approval-zaoxian108',
    250,
  ),
  approval(
    'approval-guoruimian341',
    '国瑞棉341审定证书',
    'approval-guoruimian341',
    260,
  ),
  approval(
    'approval-guoruimian8',
    '国瑞棉8号审定证书',
    'approval-guoruimian8',
    270,
  ),
  approval(
    'approval-jufengyou248',
    '巨丰优248审定证书',
    'approval-jufengyou248',
    280,
  ),
  approval('approval-xinqiang8', '新强8号审定证书', 'approval-xinqiang8', 290),
  approval(
    'approval-ruiliangyou678',
    '瑞两优678审定证书',
    'approval-ruiliangyou678',
    300,
  ),
  approval(
    'approval-ruijingzhan',
    '瑞晶占审定证书',
    'approval-ruijingzhan',
    310,
  ),
  approval(
    'approval-xiangliangyou611',
    '祥两优611审定证书',
    'approval-xiangliangyou611',
    320,
  ),
  credential(
    'tech-achievement-quality-high-yield-rice',
    {
      type: 'tech-achievement',
      level: 'provincial',
      year: '2022',
      displayOrder: 400,
    },
    {
      title: '优质高产抗逆水稻新品种培育技术研究及应用',
      summary:
        '适用于长江中下游地区种植的优质高产抗逆水稻新品种培育技术研究及应用科技成果登记。',
      documentImages: [{image: imageStub, caption: '安徽省科技成果登记证书'}],
    },
    documentRef('tech-achievement-quality-high-yield-rice'),
  ),
  credential(
    'variety-right-ruiliangyou653',
    {type: 'plant-variety-right', year: '2024', displayOrder: 500},
    {
      title: '瑞两优653植物新品种权',
      summary: '瑞两优653植物新品种权证书。',
      documentImages: [{image: imageStub, caption: '瑞两优653品种权证书'}],
    },
    documentRef('variety-right-ruiliangyou653'),
  ),
];
