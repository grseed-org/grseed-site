import type {GlobalEntry, Navigation} from '../types';

export const navigation = {
  kind: 'global',
  slug: 'navigation',
  locales: {
    'zh-hans': {
      header: [
        {label: '网站首页', href: '/'},
        {label: '关于我们', href: '/pages/about'},
        {label: '新闻博客', href: '/blog'},
        {label: '产品推介', href: '/product'},
        {label: '科研成果', href: '/pages/research'},
        {label: '客户服务', href: '/pages/service'},
        {label: '人力资源', href: '/pages/hr'},
        {label: '联系我们', href: '/pages/contact'},
      ],
      footerSections: [
        {
          key: 'about',
          label: '关于我们',
          items: [
            {label: '公司简介', href: '#about'},
            {label: '公司优势', href: '#advantages'},
            {label: '企业荣誉', href: '#honors'},
            {label: '发展历程', href: '#history'},
          ],
        },
        {
          key: 'products',
          label: '产品推介',
          items: [
            {label: '水稻', href: '/product?tag=rice'},
            {label: '油菜', href: '/product?tag=rapeseed'},
            {label: '小麦', href: '/product?tag=wheat'},
          ],
        },
        {
          key: 'updates',
          label: '内容更新',
          items: [
            {label: '新闻博客', href: '/blog'},
            {label: '科研成果', href: '/pages/research'},
            {label: '客户服务', href: '/pages/service'},
          ],
        },
        {
          key: 'research',
          label: '科研服务',
          items: [
            {label: '技术指导', href: '#guidance'},
            {label: '客户服务', href: '#service'},
            {label: '人才理念', href: '/pages/hr'},
            {label: '招聘信息', href: '/pages/hr#jobs'},
          ],
        },
      ],
    },
  },
} satisfies GlobalEntry<Navigation>;
