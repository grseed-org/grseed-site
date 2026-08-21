import {COMPANY_NAME} from '../constants';
import type {About, GlobalEntry} from '../types';

export const about = {
  kind: 'global',
  slug: 'about',
  refs: {
    'mediaSlots.0.image': {
      collection: 'media',
      key: 'company-office-main',
      field: 'assetKey',
    },
    'mediaSlots.1.image': {
      collection: 'media',
      key: 'company-field-team',
      field: 'assetKey',
    },
    'mediaSlots.2.image': {
      collection: 'media',
      key: 'event-demo-xiaomiao-2025',
      field: 'assetKey',
    },
    'mediaSlots.3.image': {
      collection: 'media',
      key: 'event-demo-ruiliangyou653',
      field: 'assetKey',
    },
    'mediaSlots.4.image': {
      collection: 'media',
      key: 'event-demo-mingguang-653',
      field: 'assetKey',
    },
    'mediaSlots.5.image': {
      collection: 'media',
      key: 'honor-high-tech-2024',
      field: 'assetKey',
    },
    'mediaSlots.6.image': {
      collection: 'media',
      key: 'honor-leading-enterprise',
      field: 'assetKey',
    },
    'mediaSlots.7.image': {
      collection: 'media',
      key: 'honor-hefei-demo-consortium-2022',
      field: 'assetKey',
    },
  },
  shared: {
    mediaSlots: [
      {key: 'hero-main'},
      {key: 'hero-support-1'},
      {key: 'hero-support-2'},
      {key: 'research-1'},
      {key: 'research-2'},
      {key: 'research-3'},
      {key: 'future-1'},
      {key: 'future-2'},
    ],
  },
  locales: {
    'zh-hans': {
      companyName: COMPANY_NAME,
      title: '关于国瑞',
      summary:
        '安徽国瑞种业成立于2004年3月，注册资本3000万元。公司以农作物种子科研、繁育、推广与服务为核心，立足安徽，面向长江中下游地区。',
      milestones: [
        {year: '2004', body: '公司成立，聚焦粮食作物育种与推广。'},
        {
          year: '2009以来',
          body: '先后获评安徽省民营科技型企业、合肥市农业产业化龙头企业等。',
        },
        {year: '2012', body: '通过 ISO9001：2008 国际质量管理体系认证。'},
        {
          year: '2016以来',
          body: '完善加工包装仓库、晒场、办公楼、低温冷库与科研示范基地布局。',
        },
      ],
      mediaSlots: [
        {key: 'hero-main', alt: '国瑞种业办公与基地环境'},
        {key: 'hero-support-1', alt: '国瑞种业田间展示与团队活动'},
        {key: 'hero-support-2', alt: '小庙观摩会现场'},
        {key: 'research-1', alt: '瑞两优653观摩会现场'},
        {key: 'research-2', alt: '明光瑞两优653观摩会现场'},
        {key: 'research-3', alt: '高新技术企业证书'},
        {key: 'future-1', alt: '农业产业化龙头企业证书'},
        {key: 'future-2', alt: '合肥市示范现代农业产业化联合体证书'},
      ],
      sections: [
        {key: 'hero', eyebrow: '关于我们 · 国瑞种业'},
        {
          key: 'company-intro',
          eyebrow: '公司简介',
          heading: '以科研为基，以良种服务农业',
          body: '安徽国瑞种业有限公司成立于2004年3月，注册资本3000万元，是一家集农作物种子科研、繁育与推广为一体的民营科技型企业、国家高新技术企业，是安徽省种子协会理事单位、中国种子协会会员单位。\n\n公司核心管理层由一批致力于种子事业的育种家和经验丰富的管理人员组成。公司以自主知识产权品种为主，销售网络遍布长江中下游地区，形成全方位、多层次、宽领域的销售格局。',
        },
        {key: 'milestones', heading: '发展里程碑', body: '把基础做扎实，把品种做更好'},
        {
          key: 'products',
          eyebrow: '产品布局',
          heading: '主营品种',
          body: '以杂交水稻和常规水稻为核心，兼顾小麦、油菜、棉花等作物方向。',
        },
        {
          key: 'approvals',
          eyebrow: '审定进展',
          heading: '品种审定与成果转化',
          body: '公司长期参加国家、安徽省及其他省份区域试验，持续推动新品种审定、示范推广和科研成果转化。',
        },
        {
          key: 'research-base',
          eyebrow: '科研与基地',
          heading: '科研育种 · 试验示范 · 稳定制种',
          body: '公司建立800多亩科研育种、试验示范基地，分布在合肥市蜀山区小庙镇、合肥市肥东县和海南省三亚市，并在安徽、江苏、福建、江西、湖南、广东、广西等地建立稳定杂交水稻种子生产基地。',
        },
        {
          key: 'research-location',
          heading: '联合体试验基地',
          body: '长江中下游中籼水稻联合体试验基地、长江中下游麦茬稻联合体试验基地、安徽省中籼联合体试验基地。',
        },
        {
          key: 'research-breeding',
          heading: '产学研合作网络',
          body: '与中国水稻所、国家杂交水稻工程技术研究中心、安徽省农科院、安徽农业大学、安徽科技学院、宣城市农科所、当涂县农科所、湖北省宜昌农科院等建立长期合作关系。',
        },
        {
          key: 'future',
          eyebrow: '面向未来',
          heading: '现代化民族种业企业',
          body: '安徽国瑞种业将继续秉承“富民强国，瑞泽天下”的经营理念，坚持让“经销商合作省心，零售商销售安心，农民用种放心”的质量管理方针，持续探索产学研结合机制，提升育种和营销创新能力。',
        },
      ],
    },
  },
} satisfies GlobalEntry<About>;
