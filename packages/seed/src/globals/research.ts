import type {GlobalEntry, Research} from '../types';

export const research = {
  kind: 'global',
  slug: 'research',
  refs: {
    heroImage: {
      collection: 'media',
      key: 'event-demo-ruiliangyou653',
      field: 'assetKey',
    },
  },
  locales: {
    'zh-hans': {
      title: '科研成果',
      summary:
        '围绕新品种选育、试验示范、品种审定、知识产权和科技成果转化，展示国瑞种业的科研生产能力。',
      sections: [
        {
          key: 'hero',
          eyebrow: '科研成果',
          heading: '以品种创新服务粮食生产',
          body: '公司承担并参与国家农业科技成果转化、安徽省科技重大专项、合肥市共性关键技术、现代农业发展项目及安徽省水稻良种攻关项目等。',
        },
        {
          key: 'projects',
          heading: '承担与参与项目',
          body: '优质、高产中籼新组合两优669中试与示范；适宜长江中下游地区种植的优质高产抗逆水稻新品种培育技术研究及应用；耐热高产抗病氮高效水稻新品种选育与应用；种子质量全程追溯项目。',
        },
        {
          key: 'credentials',
          heading: '证书与知识产权',
          body: '品种审定证书、植物新品种权、专利、科技成果登记证书和公司荣誉共同构成科研成果展示体系。',
        },
      ],
    },
  },
} satisfies GlobalEntry<Research>;
