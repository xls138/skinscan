/**
 * [INPUT]: zod validation library
 * [OUTPUT]: SkinScanSchema, AURA_TYPES, AURA_TAGLINES
 * [POS]: lib/schema - JSON Schema definitions for Gemini API responses
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { z } from 'zod';

// ============================================================================
// AURA TYPE DEFINITIONS - 16 TYPES PER GENDER
// ============================================================================

export const FEMALE_AURA_TYPES = {
  cool_goddess: {
    label: '清冷系 · 白月光',
    keywords: ['疏离感', '骨相美', '留白美学'],
    style: 'poetic'
  },
  ice_queen: {
    label: '冰山系 · 高岭之花',
    keywords: ['冷艳', '生人勿近', '距离感'],
    style: 'poetic'
  },
  sweet_first_love: {
    label: '甜美系 · 初恋脸',
    keywords: ['少女感', '胶原蛋白', '苹果肌'],
    style: 'praise'
  },
  cute_baby: {
    label: '奶萌系 · 幼态甜心',
    keywords: ['娃娃脸', '圆眼睛', '软萌'],
    style: 'praise'
  },
  sunny_girl: {
    label: '元气系 · 阳光甜妹',
    keywords: ['活力', '笑容治愈', '正能量'],
    style: 'viral'
  },
  queen_elegant: {
    label: '御姐系 · 人间富贵花',
    keywords: ['气场', '锐利感', '女王气质'],
    style: 'viral'
  },
  boss_lady: {
    label: '大女主 · 野心家',
    keywords: ['强势', '精英感', '事业脸'],
    style: 'viral'
  },
  mature_charm: {
    label: '熟女系 · 风情万种',
    keywords: ['成熟', '韵味', '女人味'],
    style: 'poetic'
  },
  pure_desire: {
    label: '纯欲系 · 欲拒还迎',
    keywords: ['清纯', '性感', '矛盾美'],
    style: 'poetic'
  },
  melancholy: {
    label: '厌世系 · 忧郁缪斯',
    keywords: ['颓废', '文艺', '故事感'],
    style: 'poetic'
  },
  mysterious: {
    label: '神秘系 · 猫系女生',
    keywords: ['慵懒', '高冷', '难以捉摸'],
    style: 'poetic'
  },
  girl_next_door: {
    label: '邻家系 · 男友收割机',
    keywords: ['亲切', '好嫁风', '无攻击性'],
    style: 'praise'
  },
  gentle_beauty: {
    label: '温柔系 · 岁月静好',
    keywords: ['温婉', '知性', '书卷气'],
    style: 'poetic'
  },
  retro_classic: {
    label: '港风系 · 复古女神',
    keywords: ['浓颜', '复古', '胶片感'],
    style: 'poetic'
  },
  edgy_cool: {
    label: '酷飒系 · 人间清醒',
    keywords: ['中性', '酷帅', '飒爽'],
    style: 'viral'
  },
  exotic_beauty: {
    label: '混血系 · 异域风情',
    keywords: ['立体', '深邃', '异国感'],
    style: 'praise'
  }
};

export const MALE_AURA_TYPES = {
  cold_prince: {
    label: '清冷系 · 禁欲男神',
    keywords: ['疏离', '高冷', '距离感'],
    style: 'poetic'
  },
  warm_sunshine: {
    label: '阳光系 · 初恋男友',
    keywords: ['温暖', '干净', '少年感'],
    style: 'praise'
  },
  gentle_scholar: {
    label: '书生系 · 温润如玉',
    keywords: ['儒雅', '书卷气', '谦谦君子'],
    style: 'poetic'
  },
  mature_elite: {
    label: '精英系 · 霸总本总',
    keywords: ['成熟', '气场', '事业型'],
    style: 'viral'
  },
  bad_boy: {
    label: '痞帅系 · 坏男孩',
    keywords: ['痞气', '不羁', '危险感'],
    style: 'viral'
  },
  artistic_soul: {
    label: '文艺系 · 忧郁诗人',
    keywords: ['文艺', '敏感', '故事感'],
    style: 'poetic'
  },
  sporty_fresh: {
    label: '运动系 · 校草担当',
    keywords: ['阳光', '健康', '活力'],
    style: 'praise'
  },
  korean_idol: {
    label: '韩系 · 爱豆脸',
    keywords: ['精致', '白净', '偶像感'],
    style: 'praise'
  },
  japanese_soft: {
    label: '日系 · 盐系少年',
    keywords: ['清淡', '随性', '舒适感'],
    style: 'poetic'
  },
  tough_guy: {
    label: '硬汉系 · 荷尔蒙炸裂',
    keywords: ['阳刚', '力量感', '男人味'],
    style: 'viral'
  },
  retro_hong_kong: {
    label: '港风系 · 复古男神',
    keywords: ['浓颜', '复古', '胶片感'],
    style: 'poetic'
  },
  mysterious_wolf: {
    label: '狼系 · 野性难驯',
    keywords: ['深邃', '神秘', '攻击性'],
    style: 'viral'
  },
  puppy_boy: {
    label: '犬系 · 奶狗男友',
    keywords: ['粘人', '可爱', '撒娇'],
    style: 'praise'
  },
  gentleman: {
    label: '绅士系 · 英伦贵族',
    keywords: ['优雅', '礼貌', '贵气'],
    style: 'poetic'
  },
  mixed_exotic: {
    label: '混血系 · 异域王子',
    keywords: ['立体', '深邃', '异国感'],
    style: 'praise'
  },
  neighbor_brother: {
    label: '邻家系 · 国民老公',
    keywords: ['亲切', '靠谱', '安全感'],
    style: 'praise'
  }
};

export const AURA_TYPES = { ...FEMALE_AURA_TYPES, ...MALE_AURA_TYPES };

// ============================================================================
// TAGLINE TEMPLATES BY AURA TYPE
// ============================================================================

export const AURA_TAGLINES = {
  cool_goddess: [
    '眉间疏朗，自有一种不染尘埃的清贵气',
    '骨相里藏着月光，是人群中最清冷的那一抹白',
    '不必刻意，周身自带三分疏离七分贵气'
  ],
  ice_queen: [
    '生人勿近的气场，却让人忍不住想靠近',
    '冷艳到极致就是高级，你就是行走的禁区',
    '眼神里写满了"我不需要任何人"的笃定'
  ],
  sweet_first_love: [
    '笑起来像草莓味的夏天，让人想要保护',
    '满脸都写着"请宠我"，是行走的少女感教科书',
    '眼睛里住着小星星，看一眼就想rua'
  ],
  cute_baby: [
    '软萌得像刚出炉的奶黄包，让人想捏',
    '这张脸是用来骗零食的吧，太犯规了',
    '娃娃脸配圆眼睛，可爱值直接拉满'
  ],
  sunny_girl: [
    '笑容能给手机充电，是行走的正能量发电机',
    '看到你就想跟着一起笑，感染力太强了',
    '活力满满的样子，让人想和你一起去海边'
  ],
  queen_elegant: [
    '这张脸写满了"别惹我但可以爱我"，绝',
    '姐的气场两米八，建议直接出道',
    '眉眼间全是故事，一看就是大女主剧本'
  ],
  boss_lady: [
    '一看就是能签千万合同的狠角色',
    '精英感拉满，霸总文女主照进现实',
    '这气场，开会坐C位毫无违和感'
  ],
  mature_charm: [
    '岁月在你脸上只留下了风情万种',
    '成熟女人的魅力，是少女模仿不来的',
    '眼角眉梢都是故事，让人想听你讲'
  ],
  pure_desire: [
    '清纯和性感的完美结合，这就是纯欲天花板',
    '欲拒还迎的眼神，让人心跳漏一拍',
    '看起来很乖，但眼神里藏着小秘密'
  ],
  melancholy: [
    '眼里藏着故事，嘴角挂着秘密，氛围感拉满',
    '忧郁得像午后三点的咖啡馆，让人想走近',
    '这种文艺感，配一首后摇刚刚好'
  ],
  mysterious: [
    '慵懒中带着性感，是让人移不开眼的类型',
    '像猫一样难以捉摸，让人想要了解更多',
    '你的气质是一本读不完的悬疑小说'
  ],
  girl_next_door: [
    '是让人看一眼就想带回家见妈妈的类型',
    '亲和力满分，笑容有治愈人心的魔力',
    '自带好嫁风滤镜，是男生心中的理想型'
  ],
  gentle_beauty: [
    '温柔得像三月的春风，让人想靠近',
    '岁月静好的样子，适合一起喝下午茶',
    '知性又温婉，是书里走出来的女主角'
  ],
  retro_classic: [
    '这张脸放在90年代就是挂历女神',
    '浓颜系天花板，港风滤镜都多余',
    '复古感拉满，随便一拍都是胶片质感'
  ],
  edgy_cool: [
    '飒得像刚从摩托车上下来的酷女孩',
    '中性美的天花板，帅到女生都心动',
    '人间清醒的样子，让人想追随'
  ],
  exotic_beauty: [
    '五官立体得像混血，基因太强了',
    '异域风情配深邃眼眸，直接封神',
    '这张脸在哪个国家都能当明星'
  ],
  cold_prince: [
    '禁欲系天花板，让人想打破你的冷漠',
    '眼神里的疏离感，是高级感的代名词',
    '冷到极致就是帅，你就是行走的冰山'
  ],
  warm_sunshine: [
    '笑起来像冬天的暖阳，让人想靠近',
    '干净的少年感，是初恋该有的样子',
    '眼睛里住着星星，温柔得像首情诗'
  ],
  gentle_scholar: [
    '温润如玉的气质，让人如沐春风',
    '书卷气满满，是从诗词里走出来的公子',
    '君子端方，谦谦有礼，让人想读懂你'
  ],
  mature_elite: [
    '霸总本总，这气场我先磕为敬',
    '一看就是能掌控会议室的男人',
    '成熟稳重得让人想叫一声老公'
  ],
  bad_boy: [
    '痞帅痞帅的，危险又让人想靠近',
    '坏男孩的魅力，是乖乖女的克星',
    '眼神里写满了"姐姐我不乖"'
  ],
  artistic_soul: [
    '忧郁的气质像首未完成的诗',
    '文艺到骨子里，让人想听你弹吉他',
    '眼里有故事，适合在雨天相遇'
  ],
  sporty_fresh: [
    '阳光得像刚从篮球场下来的校草',
    '运动系天花板，青春荷尔蒙炸裂',
    '健康的气质让人想和你打一场球'
  ],
  korean_idol: [
    '精致得像从韩剧里走出来的爱豆',
    '这张脸出道即巅峰，建议直接组团',
    '偶像感拉满，粉丝滤镜都多余'
  ],
  japanese_soft: [
    '盐系少年的代表，清淡又舒服',
    '像日剧里的男二，让人想照顾',
    '随性的气质，是夏天该有的样子'
  ],
  tough_guy: [
    '荷尔蒙炸裂，这就是男人味',
    '硬汉系天花板，让人想被你保护',
    '阳刚之气拉满，男友力爆棚'
  ],
  retro_hong_kong: [
    '这张脸放在90年代就是四大天王',
    '浓颜系帅哥，港风滤镜都是多余',
    '复古感拉满，随便一拍都是电影海报'
  ],
  mysterious_wolf: [
    '狼系男友，野性又危险的魅力',
    '眼神深邃得像藏着秘密，让人想探索',
    '难驯的气质，是姐姐们的心头好'
  ],
  puppy_boy: [
    '奶狗系天花板，让人想rua一整天',
    '撒娇的样子太犯规，谁顶得住啊',
    '可爱得像只黏人的小狗狗'
  ],
  gentleman: [
    '绅士风度拉满，让人想说"My Lord"',
    '优雅得像从英剧里走出来的贵族',
    '礼貌又有教养，是理想中的白马王子'
  ],
  mixed_exotic: [
    '五官立体得像混血王子',
    '异域风情配深邃眼眸，基因太绝了',
    '这张脸放哪个国家都是顶流'
  ],
  neighbor_brother: [
    '国民老公既视感，让人想带回家',
    '亲切又靠谱，是父母最喜欢的类型',
    '安全感满满，适合一起过日子'
  ]
};

// ============================================================================
// ZOD SCHEMA DEFINITIONS
// ============================================================================

const AURA_TYPE_KEYS = Object.keys(AURA_TYPES);
const FEMALE_AURA_TYPE_KEYS = Object.keys(FEMALE_AURA_TYPES);
const MALE_AURA_TYPE_KEYS = Object.keys(MALE_AURA_TYPES);

const SubItemSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['优秀', '良好', '一般', '需改善'])
});

const MetricDetailSchema = z.object({
  score: z.number().min(0).max(100),
  percentile: z.number().min(0).max(100).describe('同龄人对比百分位，如87表示超过87%同龄人'),
  sub_items: z.object({
    item1: SubItemSchema,
    item2: SubItemSchema,
    item3: SubItemSchema,
    item4: SubItemSchema
  }),
  diagnosis: z.string().max(100).describe('专业诊断，一句话解读'),
  suggestion: z.string().max(80).describe('针对性建议')
});

export const SkinScanSchema = z.object({
  gender: z.enum(['female', 'male'])
    .describe('性别，由AI自动判断'),
  
  aura_type: z.enum(AURA_TYPE_KEYS)
    .describe('气质类型分类，根据性别从对应16种类型中选择'),
  
  predicted_age: z.number().min(15).max(60)
    .describe('AI预测年龄'),
  
  beauty_score: z.number().min(0).max(100)
    .describe('颜值评分 0-100'),
  
  tagline: z.string().max(50)
    .describe('一句话评语，根据气质类型匹配风格'),

  radar: z.object({
    youthfulness: z.number().min(0).max(100).describe('少女感/少年感'),
    elegance: z.number().min(0).max(100).describe('高级感'),
    vibe: z.number().min(0).max(100).describe('氛围感'),
    affinity: z.number().min(0).max(100).describe('亲和力'),
    uniqueness: z.number().min(0).max(100).describe('个性度')
  }).describe('雷达图5维度总分'),

  radar_detail: z.object({
    youthfulness: MetricDetailSchema.extend({
      sub_items: z.object({
        collagen: SubItemSchema.describe('胶原蛋白'),
        apple_cheeks: SubItemSchema.describe('苹果肌'),
        plumpness: SubItemSchema.describe('饱满度'),
        skin_texture: SubItemSchema.describe('肌肤质感')
      })
    }).describe('少女感详细分析'),
    
    elegance: MetricDetailSchema.extend({
      sub_items: z.object({
        bone_structure: SubItemSchema.describe('骨相'),
        contour: SubItemSchema.describe('轮廓'),
        proportions: SubItemSchema.describe('比例'),
        refinement: SubItemSchema.describe('精致度')
      })
    }).describe('高级感详细分析'),
    
    vibe: MetricDetailSchema.extend({
      sub_items: z.object({
        eye_expression: SubItemSchema.describe('眼神'),
        demeanor: SubItemSchema.describe('神态'),
        aura: SubItemSchema.describe('气场'),
        charisma: SubItemSchema.describe('魅力值')
      })
    }).describe('氛围感详细分析')
  }),

  metrics_detail: z.object({
    skin_quality: MetricDetailSchema.extend({
      sub_items: z.object({
        luminosity: SubItemSchema.describe('光泽度'),
        smoothness: SubItemSchema.describe('细腻度'),
        evenness: SubItemSchema.describe('均匀度'),
        pores: SubItemSchema.describe('毛孔状态')
      })
    }).describe('肤质状态详细分析'),
    
    anti_aging: MetricDetailSchema.extend({
      sub_items: z.object({
        nasolabial: SubItemSchema.describe('法令纹'),
        eye_area: SubItemSchema.describe('眼周状态'),
        firmness: SubItemSchema.describe('紧致度'),
        elasticity: SubItemSchema.describe('弹性')
      })
    }).describe('抗老指数详细分析'),
    
    vitality: MetricDetailSchema.extend({
      sub_items: z.object({
        complexion: SubItemSchema.describe('气色'),
        dark_circles: SubItemSchema.describe('黑眼圈'),
        fatigue: SubItemSchema.describe('疲态'),
        hydration: SubItemSchema.describe('水润度')
      })
    }).describe('元气值详细分析')
  }),

  concerns: z.array(z.string()).max(3)
    .describe('检测到的问题点，用于制造悬念')
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/** @typedef {z.infer<typeof SkinScanSchema>} SkinScanResult */

export default SkinScanSchema;
