import type {GlobalEntry, Service} from '../types';

export const service = {
  kind: 'global',
  slug: 'service',
  refs: {
    heroImage: {
      collection: 'media',
      key: 'event-demo-mingguang-653',
      field: 'assetKey',
    },
  },
  locales: {
    'zh-hans': {
      title: '客户服务',
      summary:
        '围绕经销商、零售商和农户建立服务闭环，提供品种选择、栽培技术、田间管理和售后支持。',
      sections: [
        {
          key: 'hero',
          eyebrow: '客户服务',
          heading: '让合作省心、销售安心、用种放心',
          body: '国瑞种业坚持质量管理与应用服务并重，把良种、良法和田间反馈连接起来。',
        },
        {
          key: 'dealer',
          heading: '经销商支持',
          body: '提供品种资料、示范观摩、销售政策沟通和区域推广支持，帮助渠道伙伴建立清晰产品组合。',
        },
        {
          key: 'farmer',
          heading: '农户用种服务',
          body: '围绕播种、育秧、移栽、肥水管理、病虫害防治等关键环节，提供可落地的技术指导。',
        },
      ],
    },
  },
} satisfies GlobalEntry<Service>;
