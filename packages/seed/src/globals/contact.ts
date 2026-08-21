import {COMPANY_NAME} from '../constants';
import type {Contact, GlobalEntry} from '../types';

// Company contact details. Identity values (phone/email/website) are `shared`;
// localized prose (companyName/address) is per-locale. The region-manager
// `contacts` array carries both: `role`/`name` are localized so it sits under
// `locales`, while each `mobile` is a non-localized identity value (a phone
// number is the same in any language) and Payload stores it once.
export const contact = {
  kind: 'global',
  slug: 'contact',
  shared: {
    phone: '0551-68896787',
    email: 'grzy8888@126.com',
    website: 'https://www.grseed.com',
  },
  locales: {
    'zh-hans': {
      companyName: COMPANY_NAME,
      address: '合肥市蜀山区小庙镇墩塘1号',
      contacts: [
        {role: '副总经理', name: '周杨', mobile: '18956089171'},
      ],
      sections: [
        {
          key: 'hero',
          eyebrow: '联系我们',
          heading: '联系我们',
          body: '如需了解产品、服务、渠道合作或技术支持，欢迎与安徽国瑞种业有限公司联系。',
        },
        {
          key: 'company-info',
          heading: '公司信息',
          body: '点击信息项即可复制，便于保存和转发。',
        },
        {
          key: 'contacts',
          eyebrow: '联系人',
          heading: '业务对接人员',
          body: '点击卡片即可复制手机号。',
        },
      ],
    },
  },
} satisfies GlobalEntry<Contact>;
