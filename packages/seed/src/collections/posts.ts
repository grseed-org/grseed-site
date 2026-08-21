import type {Authoring, CollectionEntry, Post} from '../types';

const post = (
  key: string,
  categoryKey: string,
  tagKeys: string[],
  publishedAt: string,
  zh: Partial<Authoring<Post>>,
  coverAssetKey?: string,
  credentialKeys: string[] = [],
  coverCredentialKey?: string,
): CollectionEntry<Post> => ({
  kind: 'collection',
  slug: 'posts',
  key,
  refs: {
    category: {collection: 'categories', key: categoryKey},
    tags: {collection: 'tags', keys: tagKeys},
    ...(coverAssetKey
      ? {
          cover: {
            collection: 'media' as const,
            key: coverAssetKey,
            field: 'assetKey',
          },
        }
      : {}),
    ...(credentialKeys.length > 0
      ? {
          credentials: {
            collection: 'credentials' as const,
            keys: credentialKeys,
          },
        }
      : {}),
    ...(coverCredentialKey
      ? {
          coverCredential: {
            collection: 'credentials' as const,
            key: coverCredentialKey,
          },
        }
      : {}),
  },
  shared: {
    publishedAt,
    _status: 'published',
  },
  locales: {'zh-hans': zh},
});

const credentialArticle = (
  key: string,
  title: string,
  summary: string,
  credentialKeys: string[] = [key],
  coverCredentialKey = credentialKeys[0],
): CollectionEntry<Post> =>
  post(
    key,
    'credentials',
    [],
    '2026-01-01',
    {
      title,
      summary,
      content: `${summary}\n\n本文用于集中说明相关证书、资质类型和产品支撑关系；证书编号、年份、级别与原件图片以关联的证书资料为准。`,
    },
    undefined,
    credentialKeys,
    coverCredentialKey,
  );

export const posts: CollectionEntry<Post>[] = [
  post(
    'daohailongzhu-hubei-demo',
    'event',
    ['rice', 'daohai-series', 'hubei', 'taste-quality'],
    '2024-09-09',
    {
      title: '国瑞种业稻海龙珠湖北省级观摩会',
      summary:
        '金秋送爽，龙珠献稻。安徽国瑞种业在湖北天门召开稻海龙珠省级观摩会。',
      content:
        '国瑞种业围绕稻海龙珠（瑞两优088）开展湖北省级观摩活动，通过田间展示、品种交流和渠道沟通，让经销商与种植户直观看到品种表现。\n\n观摩推广是公司连接科研成果与市场应用的重要方式。后续将继续围绕重点品种开展示范展示和技术服务。',
    },
    'product-ruiliangyou088-field-1',
  ),
  post(
    'crri-experts-guidance',
    'news',
    ['rice', 'indica-japonica', 'high-quality'],
    '2024-09-12',
    {
      title: '中国水稻研究所专家指导国瑞种业籼粳亚种间杂交优势利用',
      summary:
        '围绕水稻育种技术突破与粮食安全，专家到国瑞种业开展技术指导与交流。',
      content:
        '水稻育种技术的每一次突破，都关系到粮食安全与农业可持续发展。中国水稻研究所专家到国瑞种业开展籼粳亚种间杂交优势利用指导，为新品种选育与应用推广提供专业支持。\n\n国瑞种业将继续加强产学研合作，把科研资源、试验示范和市场反馈连接起来。',
    },
    'company-field-team',
  ),
  post(
    'xiaomiao-demo-2025',
    'event',
    ['rice', 'anhui', 'high-yield'],
    '2025-09-01',
    {
      title: '2025年小庙观摩会',
      summary: '依托小庙科研育种与试验示范基地，集中展示重点品种田间表现。',
      content:
        '小庙基地是国瑞种业科研育种、试验示范和品种展示的重要场景。2025年观摩会围绕重点推广品种展开，通过田间实景展示品种长势、穗型、熟期和抗逆表现。\n\n观摩会资料将持续沉淀到产品中心和科研成果页面，便于渠道伙伴和种植户按品种查询。',
    },
    'event-demo-xiaomiao-2025',
  ),
  post(
    'ruiliangyou653-mingguang-demo',
    'event',
    ['rice', 'ruiliangyou-series', 'anhui', 'high-yield'],
    '2025-09-22',
    {
      title: '明光瑞两优653观摩会',
      summary: '围绕瑞两优653开展区域观摩展示，验证田间表现和推广价值。',
      content:
        '瑞两优653是国瑞种业重点推广品种之一。明光观摩会通过现场展示和交流，帮助渠道伙伴理解品种定位、适宜区域和栽培管理重点。',
    },
    'event-demo-mingguang-653',
  ),
  post(
    'rice-cultivation-guide',
    'technical-guidance',
    ['rice', 'high-yield', 'disease-resistant'],
    '2025-03-10',
    {
      title: '水稻栽培技术指导要点',
      summary:
        '面向经销商与农户的水稻栽培技术指导，覆盖育秧、移栽、肥水管理与病虫害防治。',
      content:
        '水稻高产稳产需要良种良法配套。建议结合当地播期、土壤肥力、病虫害发生规律和品种熟期安排育秧、移栽和田间管理。\n\n重点关注：培育壮秧、合理密植、科学肥水管理、病虫害综合防治，以及极端高温或连续阴雨天气下的应急管理。',
    },
  ),
  post('customer-service-system', 'customer-service', ['anhui'], '2025-02-01', {
    title: '国瑞种业客户服务体系',
    summary:
      '围绕经销商、零售商和农户建立服务闭环，提供品种资料、技术指导和售后支持。',
    content:
      '国瑞种业坚持让经销商合作省心、零售商销售安心、农民用种放心。公司通过品种资料、示范观摩、技术指导和售后反馈，持续提升服务质量。\n\n如需产品资料或技术支持，可通过联系页面获取业务对接方式。',
  }),
  post(
    'dealer-support',
    'dealer-support',
    ['rice', 'wheat', 'anhui'],
    '2025-02-15',
    {
      title: '渠道合作与区域推广支持',
      summary:
        '为渠道伙伴提供品种组合、观摩展示和区域推广支持，帮助建立稳定销售体系。',
      content:
        '国瑞种业销售网络覆盖长江中下游地区。公司根据区域种植结构、主推品种和渠道需求，提供产品组合建议、观摩会支持、技术资料和售后协同。',
    },
  ),
  post(
    'research-production-materials',
    'research-production',
    ['rice', 'high-quality', 'high-yield'],
    '2025-04-15',
    {
      title: '科研生产：品种资源与材料创制',
      summary: '围绕品种资源、材料创制、组合鉴定与比较试验建设科研生产能力。',
      content:
        '国瑞种业以品种资源和材料创制为基础，通过组合鉴定、比较试验、区域试验和展示示范推动新品种选育。科研生产的目标不是停留在实验室，而是形成可推广、可服务、可持续迭代的品种体系。',
    },
  ),
  post(
    'research-production-projects',
    'research-production',
    ['rice', 'high-quality', 'high-yield'],
    '2025-04-18',
    {
      title: '承担与参与项目',
      summary:
        '围绕中试示范、新品种培育、耐热抗病氮高效选育与种子质量追溯建设科研生产能力。',
      content:
        '公司承担与参与优质、高产中籼新组合两优669中试与示范；适宜长江中下游地区种植的优质高产抗逆水稻新品种培育技术研究及应用；耐热高产抗病氮高效水稻新品种选育与应用；种子质量全程追溯项目。\n\n品种审定证书、植物新品种权、专利、科技成果登记证书和公司荣誉共同构成科研成果展示体系。',
    },
  ),
  post(
    'applied-technology-extension',
    'applied-technology',
    ['rice', 'disease-resistant', 'high-yield'],
    '2025-04-20',
    {
      title: '应用技术推广与服务体系',
      summary: '面向经销商、零售商、农户的应用技术指导与服务体系建设。',
      content:
        '良种需要良法配套。国瑞种业围绕重点品种建立应用技术服务，从播种、育秧、移栽到肥水管理、病虫害防治和收获前管理，持续输出可落地的种植建议。',
    },
  ),
  post(
    'research-achievements-breeding',
    'research-achievements',
    ['rice', 'two-line-hybrid', 'indica-japonica'],
    '2025-05-05',
    {
      title: '科研成果：新品种选育与示范推广',
      summary: '新品种选育、示范推广、观摩会与行业交流共同构成成果转化链路。',
      content:
        '公司每年持续推动育成新品种参加国家、安徽省或其他省份区域试验，并将通过审定、登记、品种权、专利和科技成果登记的资料沉淀为可查询的科研成果。',
    },
  ),
  credentialArticle(
    'honor-high-tech-2024',
    '高新技术企业证书',
    '安徽国瑞种业有限公司获评国家高新技术企业，体现公司在研发投入、技术成果转化和创新管理方面的持续建设。',
  ),
  credentialArticle(
    'honor-leading-enterprise',
    '农业产业化龙头企业',
    '农业产业化龙头企业资质体现公司在经营组织、推广服务和产业协同方面的基础能力。',
  ),
  credentialArticle(
    'honor-hefei-demo-consortium-2022',
    '合肥市示范现代农业产业化联合体',
    '合肥市示范现代农业产业化联合体荣誉体现公司参与现代农业协同发展和区域产业建设的情况。',
  ),
  credentialArticle(
    'award-ruiliangyou088-taste',
    '瑞两优088食味品质金奖',
    '瑞两优088在食味品质评价中获得金奖，是稻海龙珠产品品质展示的重要支撑资料。',
    ['award-ruiliangyou088-taste'],
  ),
  credentialArticle(
    'award-ruiliangyou516-taste',
    '瑞两优516食味品质金奖',
    '瑞两优516在食味品质评价中获得金奖，是瑞晶香占产品品质展示的重要支撑资料。',
    ['award-ruiliangyou516-taste'],
  ),
  credentialArticle(
    'taste-quality-awards-2024',
    '瑞两优088与瑞两优516食味品质金奖',
    '瑞两优088、瑞两优516在食味品质评价中获得金奖，是产品品质展示和市场推广的重要支撑资料。',
    ['award-ruiliangyou088-taste', 'award-ruiliangyou516-taste'],
    'award-ruiliangyou088-taste',
  ),
  credentialArticle(
    'approval-ruiliangyou9578',
    '瑞两优9578审定证书',
    '瑞两优9578审定证书用于说明该品种通过审定后的推广基础和适宜区域信息。',
  ),
  credentialArticle(
    'approval-ruiliangyou1578',
    '瑞两优1578审定证书',
    '瑞两优1578审定证书用于说明该两系杂交水稻品种的审定信息和产品体系定位。',
  ),
  credentialArticle(
    'approval-ruiliangyou653',
    '瑞两优653审定证书',
    '瑞两优653审定证书与品种权资料共同支撑该品种在产品中心和科研成果中的展示。',
  ),
  credentialArticle(
    'approval-liangyou1598',
    '两优1598审定证书',
    '两优1598审定证书用于说明该品种的审定基础和产品推广资料来源。',
  ),
  credentialArticle(
    'approval-huiliangyou899',
    '徽两优899审定证书',
    '徽两优899审定证书用于说明徽两优系列品种的审定资质。',
  ),
  credentialArticle(
    'approval-liangyou7871',
    '两优7871审定证书',
    '两优7871审定证书用于归档该品种的审定材料和公开展示信息。',
  ),
  credentialArticle(
    'approval-liangyou8876',
    '两优8876审定证书',
    '两优8876审定证书用于说明稻海之星相关品种的审定依据。',
  ),
  credentialArticle(
    'approval-ruiliangyou088',
    '瑞两优088审定证书',
    '瑞两优088审定证书与食味品质荣誉共同构成稻海龙珠产品展示的资质支撑。',
  ),
  credentialArticle(
    'approval-ruiliangyou851',
    '瑞两优851审定证书',
    '瑞两优851审定证书用于说明该品种的审定信息和推广基础。',
  ),
  credentialArticle(
    'approval-ruiliangyousimiao',
    '瑞两优丝苗审定证书',
    '瑞两优丝苗审定证书用于说明丝苗型优质品种的审定资料。',
  ),
  credentialArticle(
    'approval-ruiliangyou516',
    '瑞两优516审定证书',
    '瑞两优516审定证书与食味品质荣誉共同支撑瑞晶香占的产品展示。',
  ),
  credentialArticle(
    'approval-ruijingmai8441',
    '瑞晶麦8441审定证书',
    '瑞晶麦8441审定证书用于说明该小麦品种的审定信息。',
  ),
  credentialArticle(
    'approval-ruiliangyou1576',
    '瑞两优1576审定证书',
    '瑞两优1576审定证书用于补充瑞两优系列品种的资质资料。',
  ),
  credentialArticle(
    'approval-liangyou9526',
    '两优9526审定证书',
    '两优9526审定证书用于补充两优系列品种的资质资料。',
  ),
  credentialArticle(
    'approval-liangyou992',
    '两优992审定证书',
    '两优992审定证书用于补充两优系列品种的资质资料。',
  ),
  credentialArticle(
    'approval-zaoxian108',
    '早籼108审定证书',
    '早籼108审定证书用于说明常规早籼水稻品种的审定资料。',
  ),
  credentialArticle(
    'approval-guoruimian341',
    '国瑞棉341审定证书',
    '国瑞棉341审定证书用于说明棉花品种的审定资料。',
  ),
  credentialArticle(
    'approval-guoruimian8',
    '国瑞棉8号审定证书',
    '国瑞棉8号审定证书用于说明棉花品种的审定资料。',
  ),
  credentialArticle(
    'approval-jufengyou248',
    '巨丰优248审定证书',
    '巨丰优248审定证书用于归档公司相关品种审定资料。',
  ),
  credentialArticle(
    'approval-xinqiang8',
    '新强8号审定证书',
    '新强8号审定证书用于归档公司相关品种审定资料。',
  ),
  credentialArticle(
    'approval-ruiliangyou678',
    '瑞两优678审定证书',
    '瑞两优678审定证书用于补充瑞两优系列品种的资质资料。',
  ),
  credentialArticle(
    'approval-ruijingzhan',
    '瑞晶占审定证书',
    '瑞晶占审定证书用于归档瑞晶系列相关品种审定资料。',
  ),
  credentialArticle(
    'approval-xiangliangyou611',
    '祥两优611审定证书',
    '祥两优611审定证书用于归档公司相关品种审定资料。',
  ),
  credentialArticle(
    'tech-achievement-quality-high-yield-rice',
    '优质高产抗逆水稻新品种培育技术研究及应用',
    '该科技成果登记资料用于说明公司围绕优质、高产、抗逆水稻新品种培育方向形成的技术成果。',
  ),
  credentialArticle(
    'variety-right-ruiliangyou653',
    '瑞两优653植物新品种权',
    '瑞两优653植物新品种权证书用于说明该品种的知识产权保护情况。',
  ),
];
