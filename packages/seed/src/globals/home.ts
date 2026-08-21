import {COMPANY_NAME} from '../constants';
import type {GlobalEntry, Home} from '../types';

export const home = {
  kind: 'global',
  slug: 'home',
  refs: {
    heroImage: {
      collection: 'media',
      key: 'company-field-team',
      field: 'assetKey',
    },
  },
  locales: {
    'zh-hans': {
      title: '富民强国，瑞泽天下',
      companyName: COMPANY_NAME,
      summary: '集农作物种子科研、繁育、推广与服务为一体',
      achievements: [
        {label: '成立时间', value: '2004年'},
        {label: '注册资本', value: '3000万元'},
        {label: '年销售良种', value: '300万斤'},
      ],
      advantages: [
        {
          title: '自主品种体系',
          description:
            '以自主知识产权品种为主，覆盖杂交水稻、常规水稻、小麦、油菜与棉花等方向。',
        },
        {
          title: '科研与基地协同',
          description:
            '建设科研育种、试验示范与稳定制种基地，支撑材料创制、组合筛选和示范推广。',
        },
        {
          title: '渠道服务能力',
          description:
            '销售网络覆盖长江中下游地区，面向经销商、零售商和农户提供技术与售后支持。',
        },
      ],
      sections: [
        {key: 'products', eyebrow: '产品中心', heading: '重点品种'},
        {
          key: 'company-intro',
          eyebrow: '关于国瑞',
          heading: '扎根种业二十余年',
          body: '安徽国瑞种业有限公司成立于2004年3月，注册资本3000万元，是一家集农作物种子科研、繁育与推广为一体的民营科技型企业、国家高新技术企业。公司以自主知识产权品种为核心，销售网络遍布长江中下游地区。',
        },
        {
          key: 'advantages',
          heading: '我们的优势',
          body: '科研、基地、生产、推广与服务形成闭环',
        },
        {
          key: 'research',
          eyebrow: '科研成果',
          heading: '品种审定 · 知识产权 · 科技成果',
        },
        {
          key: 'service',
          eyebrow: '客户服务',
          heading: '让经销商合作省心，零售商销售安心，农民用种放心',
        },
        {
          key: 'hr',
          eyebrow: '人力资源',
          heading: '发展国瑞事业，光大国瑞精神',
        },
      ],
    },
  },
} satisfies GlobalEntry<Home>;
