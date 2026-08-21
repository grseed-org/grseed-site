import {COMPANY_NAME} from '../constants';
import type {GlobalEntry, SiteSetting} from '../types';

export const siteSettings = {
  kind: 'global',
  slug: 'siteSettings',
  shared: {
    siteNameEn: 'ANHUI GUORUI SEED INDUSTRY CO. LTD.',
    siteNameEnShort: 'ANHUI GUORUI CO. LTD.',
  },
  locales: {
    'zh-hans': {
      siteName: COMPANY_NAME,
      copyright: '© 2026 安徽国瑞种业有限公司',
      icp: '皖ICP备19018326号',
      seo: {
        title: COMPANY_NAME,
        description:
          '安徽国瑞种业有限公司，集农作物种子科研、繁育与推广为一体的民营科技型企业。',
      },
    },
  },
} satisfies GlobalEntry<SiteSetting>;
