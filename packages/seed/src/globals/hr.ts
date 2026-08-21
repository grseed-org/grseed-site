import type {GlobalEntry, Hr} from '../types';

// HR (人才理念) editorial copy. Each section's icon/tone are presentation
// concerns that stay in src/data/hr-ui.ts, joined by index. The five philosophy
// values are the *un-keyed* `sections` (HrValues renders the keyless ones, in
// order); keyed sections like 'future' carry one-off prose for other components.
export const hr = {
  kind: 'global',
  slug: 'hr',
  refs: {
    'mediaSlots.0.image': {
      collection: 'media',
      key: 'company-field-team',
      field: 'assetKey',
    },
    'mediaSlots.1.image': {
      collection: 'media',
      key: 'company-office-main',
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
  },
  shared: {
    mediaSlots: [
      {key: 'hero-main'},
      {key: 'hero-support-1'},
      {key: 'hero-support-2'},
      {key: 'future-1'},
      {key: 'future-2'},
    ],
  },
  locales: {
    'zh-hans': {
      title: '以科研为基，以人才为本',
      // Hero intro paragraph.
      summary:
        '我们相信：人力资源是企业发展的重要资源。让每一位“国瑞人”在共同使命中成长，在专业舞台上创造价值。',
      highlights: [
        {title: '使命驱动', description: '把责任、诚信与担当落在日常。'},
        {title: '成长体系', description: '培训 + 指导 + 机会，持续升级能力。'},
        {title: '共创共赢', description: '尊重贡献，鼓励创造与创新。'},
      ],
      mediaSlots: [
        {key: 'hero-main', alt: '国瑞种业团队与田间展示'},
        {key: 'hero-support-1', alt: '国瑞种业办公与基地环境'},
        {key: 'hero-support-2', alt: '小庙观摩会现场'},
        {key: 'future-1', alt: '瑞两优653观摩会现场'},
        {key: 'future-2', alt: '明光瑞两优653观摩会现场'},
      ],
      journey: [
        {title: '了解国瑞', description: '从文化与使命出发，找到契合点。'},
        {title: '沟通面试', description: '开放交流，双向选择。'},
        {title: '入职成长', description: '融入团队，获得指导与培训。'},
        {title: '长期发展', description: '明确目标，持续贡献与晋升。'},
      ],
      sections: [
        {
          key: 'hero',
          eyebrow: '人才与文化',
        },
        {
          key: 'philosophy',
          eyebrow: '人才理念',
          heading: '我们如何看待“国瑞人”',
          body: '不是把“招聘”当作终点，而是把“成长与传承”当作过程。理念清晰，体系才能长期稳定。',
        },
        {
          key: 'journey',
          heading: '加入国瑞的成长路径',
          body: '从了解 → 融入 → 成长 → 发展',
        },
        {
          key: 'values',
          eyebrow: '价值主张',
          heading: '人才理念',
          body: '下面每一条，都是我们在人力资源实践中长期坚持的原则。',
        },
        {
          heading: '组织使命感——发展国瑞事业，光大国瑞精神',
          body: '国瑞人对企业有强烈的归属感和荣誉感，有浓厚的主人翁意识和组织意识；对公司的文化精神和价值观有深刻的理解。国瑞人无论身在任何岗位和环境，都能坚守岗位、爱岗敬业、诚信守规、积极主动承担公司赋予的职责和任务，把“学习国瑞，发展国瑞事业”作为终身奋斗的目标，国瑞人富有激情、不畏艰难、求真务实，并不断自我激励，把良种良法送到万村千乡，实现“良种服务农业，价值奉献社会”崇高的企业价值。',
        },
        {
          heading: '人才观——人力资源是重要资源',
          body: '安徽国瑞始终把人力资源作为公司生存发展的重要资源，人力资源是公司发展繁荣的不竭动力，更是公司宝贵的财富。贡献是才、创造是才、创新是才，英雄不问出处，人才不重出身。安徽国瑞的事业需要有德有才、有学有术、有技有能、有作有为的人兴隆和传承国瑞的事业。',
        },
        {
          heading: '人力资源工作目标——为梦想提供舞台',
          body: '我们一直在努力构建卓越的、可持续发展的人力资源体系，选拔、培养高素质的安徽“国瑞人”，打造符合企业文化、专业化的人才团队，把“国瑞人”的共同理想和个人的理想融合，为人才发展提供广阔的平台，“发展国瑞事业，光大国瑞精神”。',
        },
        {
          heading: '人力资源管理者——实现梦想的明灯',
          body: '人力资源管理者不仅是选拨人才、培养人才的管理者，更是人才发展的指导者，是人才创造价值和实现梦想的启明灯。作为人力资源管理者，我们为人才提供事业发展的平台，帮助人才实现理想更是全体管理者的责任，每一位部门负责人都是本部门的人力资源管理者，各级管理人员对下属有指导、培养、支持和激励的重要责任。',
        },
        {
          heading: '培训与培养——为理想加油',
          body: '我们始终认为，人才不是与生俱来的，而是后天学习和培养的。人才会持续不断的学习，发挥自身的长处，弥补不足，完善自我。安徽国瑞注重员工知识、技能的培训，更重视员工价值观和能力地培养。我们为员工提供入职培训、在岗“一对一”指导、任职培训、转岗培训、脱产培训、推荐学习、后备管理者培训等多种学习和提高的机会，为人生加码，为理想加油。',
        },
        // Keyed prose for HrFutureSection — kept out of the keyless philosophy
        // list above so HrValues renders only the five values.
        {
          key: 'future',
          eyebrow: '面向未来',
          heading: '为梦想提供舞台',
          body: '无论你来自哪里，我们更看重你的品格、学习力与创造力。欢迎与我们一起，把好种子、好技术、好服务带到更广阔的田野。',
        },
      ],
    },
  },
} satisfies GlobalEntry<Hr>;
