export interface MediaAsset {
  key: string;
  alt: string;
  filename: string;
  sourcePath?: string;
  sourceUrl?: string;
}

// `sourcePath` is the original dump-relative path used when first uploading to
// production. Local seed does not read it; it pulls files from production.
const local = (
  key: string,
  filename: string,
  alt: string,
  sourcePath: string,
): MediaAsset => ({
  key,
  filename,
  alt,
  sourcePath,
});

const remote = (
  key: string,
  filename: string,
  alt: string,
  sourceUrl: string,
): MediaAsset => ({key, filename, alt, sourceUrl});

export const mediaAssets: MediaAsset[] = [
  local('company-office-main', 'company-office-main.jpg', '国瑞种业办公与基地环境', '企业/企业.jpg'),
  local('company-field-team', 'company-field-team.jpg', '国瑞种业田间展示与团队活动', '企业/微信图片_20260227084830_522_25.jpg'),
  local('company-qr-code', 'company-qr-code.png', '国瑞种业二维码', '公司二维码/微信图片_20260226144048_514_25.png'),
  local('honor-hefei-demo-consortium-2022', 'honor-hefei-demo-consortium-2022.png', '2022年度合肥市示范现代产业化联合体证书', '公司荣誉/2022年度合肥市示范现代产业化联合体20230525.png'),
  local('honor-high-tech-2024', 'honor-high-tech-2024.jpg', '2024年高新技术企业证书', '公司荣誉/2024年最新高企证书.jpg'),
  local('honor-ruiliangyou088-taste-award', 'honor-ruiliangyou088-taste-award.jpg', '瑞两优088食味品质金奖', '公司荣誉/瑞两优088食味品质金奖.jpg'),
  local('honor-ruiliangyou516-taste-award', 'honor-ruiliangyou516-taste-award.jpg', '瑞两优516食味品质金奖', '公司荣誉/瑞两优516食味品质金奖.jpg'),
  local('honor-leading-enterprise', 'honor-leading-enterprise.jpg', '农业产业化龙头企业证书', '公司荣誉/龙头企业.jpg'),
  local('product-liangyou1598-field-1', 'product-liangyou1598-field-1.jpg', '两优1598田间表现', '品种图片/两优1598.jpg'),
  local('product-liangyou1598-field-2', 'product-liangyou1598-field-2.jpg', '两优1598植株与稻穗', '品种图片/两优1598(2）.jpg'),
  local('product-ruiliangyou1578-field', 'product-ruiliangyou1578-field.jpg', '瑞两优1578田间表现', '品种图片/瑞两优1578.jpg'),
  local('product-ruiliangyou653-field-1', 'product-ruiliangyou653-field-1.jpg', '瑞两优653田间表现', '品种图片/瑞两优653.jpg'),
  local('product-ruiliangyou653-field-2', 'product-ruiliangyou653-field-2.jpg', '瑞两优653稻田展示', '品种图片/瑞两优653（2）.jpg'),
  local('product-ruiliangyou851-field-1', 'product-ruiliangyou851-field-1.jpg', '瑞两优851田间表现', '品种图片/瑞两优851.jpg'),
  local('product-ruiliangyou851-field-2', 'product-ruiliangyou851-field-2.jpg', '瑞两优851植株与稻穗', '品种图片/瑞两优851（2).jpg'),
  local('product-ruiliangyou9578-field', 'product-ruiliangyou9578-field.png', '瑞两优9578田间表现', '品种图片/瑞两优9578.png'),
  local('product-ruiliangyousimiao-field', 'product-ruiliangyousimiao-field.jpg', '瑞两优丝苗田间表现', '品种图片/瑞两优丝苗.jpg'),
  local('product-ruiliangyou516-field-1', 'product-ruiliangyou516-field-1.jpg', '瑞晶香占（瑞两优516）田间表现', '品种图片/瑞晶香占（瑞两优516）.jpg'),
  local('product-ruiliangyou516-field-2', 'product-ruiliangyou516-field-2.jpg', '瑞晶香占（瑞两优516）稻田展示', '品种图片/瑞晶香占（瑞两优516）2.jpg'),
  local('product-liangyou8876-field', 'product-liangyou8876-field.jpg', '稻海之星（瑞两优8876）田间表现', '品种图片/稻海之星（瑞两优8876）.jpg'),
  local('product-ruiliangyou088-field-1', 'product-ruiliangyou088-field-1.jpg', '稻海龙珠（瑞两优088）田间表现', '品种图片/稻海龙珠（瑞两优088）.jpg'),
  local('product-ruiliangyou088-field-2', 'product-ruiliangyou088-field-2.jpg', '稻海龙珠（瑞两优088）稻田展示', '品种图片/稻海龙珠(瑞两优088）2.jpg'),
  local('product-ruiliangyou088-field-3', 'product-ruiliangyou088-field-3.jpg', '稻海龙珠（瑞两优088）植株与稻穗', '品种图片/稻海龙珠（瑞两优088）3.jpg'),
  local('approval-liangyou1598', 'approval-liangyou1598.jpg', '两优1598审定证书', '科研成果/品种审定证书/两优1598审定证书.jpg'),
  local('approval-liangyou7871', 'approval-liangyou7871.jpg', '两优7871审定证书', '科研成果/品种审定证书/两优7871审定证书.jpg'),
  local('approval-liangyou8876', 'approval-liangyou8876.png', '两优8876审定证书', '科研成果/品种审定证书/两优8876.png'),
  local('approval-liangyou9526', 'approval-liangyou9526.jpg', '两优9526审定证书', '科研成果/品种审定证书/两优9526审定证书.jpg'),
  local('approval-liangyou992', 'approval-liangyou992.png', '两优992审定证书', '科研成果/品种审定证书/两优992.png'),
  local('approval-guoruimian341', 'approval-guoruimian341.jpg', '国瑞棉341审定证书', '科研成果/品种审定证书/国瑞棉341.jpg'),
  local('approval-guoruimian8', 'approval-guoruimian8.jpg', '国瑞棉8号审定证书', '科研成果/品种审定证书/国瑞棉8号.jpg'),
  local('approval-jufengyou248', 'approval-jufengyou248.jpg', '巨丰优248审定证书', '科研成果/品种审定证书/巨丰优248.jpg'),
  local('approval-huiliangyou899', 'approval-huiliangyou899.jpg', '徽两优899审定证书', '科研成果/品种审定证书/徽两优899.jpg'),
  local('approval-xinqiang8', 'approval-xinqiang8.jpg', '新强8号审定证书', '科研成果/品种审定证书/新强8号审定证书.jpg'),
  local('approval-zaoxian108', 'approval-zaoxian108.jpg', '早籼108审定证书', '科研成果/品种审定证书/早籼108审定证书.jpg'),
  local('approval-ruiliangyou088', 'approval-ruiliangyou088.jpg', '瑞两优088审定证书', '科研成果/品种审定证书/瑞两优088审定证书.jpg'),
  local('approval-ruiliangyou1576', 'approval-ruiliangyou1576.jpg', '瑞两优1576审定证书', '科研成果/品种审定证书/瑞两优1576.jpg'),
  local('approval-ruiliangyou1578', 'approval-ruiliangyou1578.jpg', '瑞两优1578审定证书', '科研成果/品种审定证书/瑞两优1578审定证书.jpg'),
  local('approval-ruiliangyou516', 'approval-ruiliangyou516.jpg', '瑞两优516审定证书', '科研成果/品种审定证书/瑞两优516.jpg'),
  local('approval-ruiliangyou653', 'approval-ruiliangyou653.jpg', '瑞两优653审定证书', '科研成果/品种审定证书/瑞两优653.jpg'),
  local('approval-ruiliangyou678', 'approval-ruiliangyou678.jpg', '瑞两优678审定证书', '科研成果/品种审定证书/瑞两优678.jpg'),
  local('approval-ruiliangyou851', 'approval-ruiliangyou851.jpg', '瑞两优851审定证书', '科研成果/品种审定证书/瑞两优851审定证书.jpg'),
  local('approval-ruiliangyou9578', 'approval-ruiliangyou9578.jpg', '瑞两优9578审定证书', '科研成果/品种审定证书/瑞两优9578审定证书.jpg'),
  local('approval-ruiliangyousimiao', 'approval-ruiliangyousimiao.jpg', '瑞两优丝苗审定证书', '科研成果/品种审定证书/瑞两优丝苗审定证书.jpg'),
  local('approval-ruijingzhan', 'approval-ruijingzhan.jpg', '瑞晶占审定证书', '科研成果/品种审定证书/瑞晶占审定证书.jpg'),
  local('approval-ruijingmai8441', 'approval-ruijingmai8441.jpg', '瑞晶麦8441审定证书', '科研成果/品种审定证书/瑞晶麦8441.jpg'),
  local('approval-xiangliangyou611', 'approval-xiangliangyou611.png', '祥两优611审定证书', '科研成果/品种审定证书/祥两优611.png'),
  local('tech-achievement-huiliangyou899', 'tech-achievement-huiliangyou899.png', '杂交中籼新品种徽两优899的选育科技成果登记证书', '科研成果/安徽省科技成果登记证书/杂交中籼新品种徽两优899的选育20201217_01.png'),
  local('tech-achievement-ruiliangyou1578', 'tech-achievement-ruiliangyou1578.png', '杂交中籼新品种瑞两优1578的选育科技成果登记证书', '科研成果/安徽省科技成果登记证书/杂交中籼新品种瑞两优1578的选育20201217_01.png'),
  local('tech-achievement-ruiliangyou1598', 'tech-achievement-ruiliangyou1598.png', '杂交中籼新品种瑞两优1598的选育科技成果登记证书', '科研成果/安徽省科技成果登记证书/杂交中籼新品种瑞两优1598的选育20201217_01.png'),
  local('tech-achievement-ruiliangyou9578', 'tech-achievement-ruiliangyou9578.png', '杂交中籼新品种瑞两优9578的选育科技成果登记证书', '科研成果/安徽省科技成果登记证书/杂交中籼新品种瑞两优9578的选育20201217_01.png'),
  local('tech-achievement-ruiliangyousimiao', 'tech-achievement-ruiliangyousimiao.png', '杂交中籼新品种瑞两优丝苗的选育科技成果登记证书', '科研成果/安徽省科技成果登记证书/杂交中籼新品种瑞两优丝苗的选育20210623_01.png'),
  local('tech-achievement-quality-high-yield-rice', 'tech-achievement-quality-high-yield-rice.png', '优质高产抗逆水稻新品种培育技术研究及应用科技成果登记证书', '科研成果/安徽省科技成果登记证书/适用于长江中下游地区种植的优质高产抗逆水稻新品种培育技术研究及应用20220114_01.png'),
  local('variety-right-liangyou1598', 'variety-right-liangyou1598.jpg', '两优1598植物新品种权证书', '科研成果/植物新品种权/批量输出为图片/两优1598_01.jpg'),
  local('variety-right-huiliangyou899', 'variety-right-huiliangyou899.jpg', '徽两优899植物新品种权证书', '科研成果/植物新品种权/批量输出为图片/徽两优899_01.jpg'),
  local('variety-right-ruiliangyou653', 'variety-right-ruiliangyou653.jpg', '瑞两优653植物新品种权证书', '科研成果/植物新品种权/批量输出为图片/瑞两优653品种权证书_01.jpg'),
  local('variety-right-ruiliangyou851', 'variety-right-ruiliangyou851.jpg', '瑞两优851植物新品种权证书', '科研成果/植物新品种权/批量输出为图片/瑞两优851_01.jpg'),
  local('variety-right-ruiliangyou988', 'variety-right-ruiliangyou988.jpg', '瑞两优988植物新品种权证书', '科研成果/植物新品种权/批量输出为图片/瑞两优988_01.jpg'),
  local('variety-right-ruiliangyousimiao', 'variety-right-ruiliangyousimiao.jpg', '瑞两优丝苗植物新品种权证书', '科研成果/植物新品种权/批量输出为图片/瑞两优丝苗品种权证书_01.jpg'),
  local('event-demo-xiaomiao-2025', 'event-demo-xiaomiao-2025.jpg', '2025年小庙观摩会现场', '观摩推广/25年小庙观摩会.jpg'),
  local('event-demo-ruiliangyou653', 'event-demo-ruiliangyou653.jpg', '瑞两优653观摩会现场', '观摩推广/653观摩会.jpg'),
  local('event-demo-mingguang-653', 'event-demo-mingguang-653.jpg', '明光瑞两优653观摩会现场', '观摩推广/明光653观摩会.jpg'),
  remote('legacy-cover-ruiliangyou1578', 'legacy-cover-ruiliangyou1578.jpg', '瑞两优1578旧图床封面', 'https://pic1.imgdb.cn/item/69a446c4ac80c84bfd17183a.jpg'),
  remote('legacy-cover-ruiliangyou653', 'legacy-cover-ruiliangyou653.jpg', '瑞两优653旧图床封面', 'https://pic1.imgdb.cn/item/69a445dfac80c84bfd16da47.jpg'),
  remote('legacy-cover-liangyou1598', 'legacy-cover-liangyou1598.jpg', '两优1598旧图床封面', 'https://pic1.imgdb.cn/item/69a4466bac80c84bfd171784.jpg'),
  remote('legacy-cover-ruiliangyou088', 'legacy-cover-ruiliangyou088.jpg', '瑞两优088旧图床封面', 'https://pic1.imgdb.cn/item/69a44170ac80c84bfd16cf96.jpg'),
];
