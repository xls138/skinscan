import { GoogleGenAI } from "@google/genai";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";

const ALL_AURA_TYPES = [
  "cool_goddess",
  "ice_queen",
  "sweet_first_love",
  "cute_baby",
  "sunny_girl",
  "queen_elegant",
  "boss_lady",
  "mature_charm",
  "pure_desire",
  "melancholy",
  "mysterious",
  "girl_next_door",
  "gentle_beauty",
  "retro_classic",
  "edgy_cool",
  "exotic_beauty",
  "cold_prince",
  "warm_sunshine",
  "gentle_scholar",
  "mature_elite",
  "bad_boy",
  "artistic_soul",
  "sporty_fresh",
  "korean_idol",
  "japanese_soft",
  "tough_guy",
  "retro_hong_kong",
  "mysterious_wolf",
  "puppy_boy",
  "gentleman",
  "mixed_exotic",
  "neighbor_brother",
];

const SUB_ITEM_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100 },
    level: { type: "string", enum: ["优秀", "良好", "一般", "需改善"] },
  },
  required: ["score", "level"],
};

const METRIC_DETAIL_SCHEMA = (subItemNames) => ({
  type: "object",
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100 },
    percentile: { type: "integer", minimum: 0, maximum: 100 },
    sub_items: {
      type: "object",
      properties: Object.fromEntries(
        subItemNames.map((name) => [name, SUB_ITEM_SCHEMA]),
      ),
      required: subItemNames,
    },
    diagnosis: { type: "string" },
    suggestion: { type: "string" },
  },
  required: ["score", "percentile", "sub_items", "diagnosis", "suggestion"],
});

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    gender: { type: "string", enum: ["female", "male"] },
    aura_type: { type: "string", enum: ALL_AURA_TYPES },
    predicted_age: { type: "integer", minimum: 15, maximum: 60 },
    beauty_score: { type: "integer", minimum: 0, maximum: 100 },
    tagline: { type: "string" },
    radar: {
      type: "object",
      properties: {
        youthfulness: {
          type: "object",
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            insight: { type: "string" },
          },
          required: ["score", "insight"],
        },
        elegance: {
          type: "object",
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            insight: { type: "string" },
          },
          required: ["score", "insight"],
        },
        vibe: {
          type: "object",
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            insight: { type: "string" },
          },
          required: ["score", "insight"],
        },
        affinity: {
          type: "object",
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            insight: { type: "string" },
          },
          required: ["score", "insight"],
        },
        uniqueness: {
          type: "object",
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            insight: { type: "string" },
          },
          required: ["score", "insight"],
        },
      },
      required: ["youthfulness", "elegance", "vibe", "affinity", "uniqueness"],
    },
    radar_detail: {
      type: "object",
      properties: {
        youthfulness: METRIC_DETAIL_SCHEMA([
          "collagen",
          "apple_cheeks",
          "plumpness",
          "skin_texture",
        ]),
        elegance: METRIC_DETAIL_SCHEMA([
          "bone_structure",
          "contour",
          "proportions",
          "refinement",
        ]),
        vibe: METRIC_DETAIL_SCHEMA([
          "eye_expression",
          "demeanor",
          "aura",
          "charisma",
        ]),
      },
      required: ["youthfulness", "elegance", "vibe"],
    },
    metrics_detail: {
      type: "object",
      properties: {
        skin_quality: METRIC_DETAIL_SCHEMA([
          "luminosity",
          "smoothness",
          "evenness",
          "pores",
        ]),
        anti_aging: METRIC_DETAIL_SCHEMA([
          "nasolabial",
          "eye_area",
          "firmness",
          "elasticity",
        ]),
        vitality: METRIC_DETAIL_SCHEMA([
          "complexion",
          "dark_circles",
          "fatigue",
          "hydration",
        ]),
      },
      required: ["skin_quality", "anti_aging", "vitality"],
    },
    concerns: { type: "array", items: { type: "string" }, maxItems: 3 },
  },
  required: [
    "gender",
    "aura_type",
    "predicted_age",
    "beauty_score",
    "tagline",
    "radar",
    "radar_detail",
    "metrics_detail",
    "concerns",
  ],
};

const ANALYSIS_PROMPT = `你是一个专业的颜值气质分析师，为用户提供有趣的面部分析。

请分析这张照片，并返回以下信息：

0. **性别判断 (gender)**: 先判断照片中人物的性别
   - female: 女性
   - male: 男性

1. **气质类型 (aura_type)**: 根据性别，从对应的16种类型中选择最匹配的一个

   【女性类型】
   清冷系列:
   - cool_goddess: 清冷系·白月光（疏离感、骨相美、留白美学）
   - ice_queen: 冰山系·高岭之花（冷艳、生人勿近、距离感）

   甜美系列:
   - sweet_first_love: 甜美系·初恋脸（少女感、胶原蛋白、苹果肌）
   - cute_baby: 奶萌系·幼态甜心（娃娃脸、圆眼睛、软萌）
   - sunny_girl: 元气系·阳光甜妹（活力、笑容治愈、正能量）

   御姐系列:
   - queen_elegant: 御姐系·人间富贵花（气场、锐利感、女王气质）
   - boss_lady: 大女主·野心家（强势、精英感、事业脸）
   - mature_charm: 熟女系·风情万种（成熟、韵味、女人味）

   氛围感系列:
   - pure_desire: 纯欲系·欲拒还迎（清纯、性感、矛盾美）
   - melancholy: 厌世系·忧郁缪斯（颓废、文艺、故事感）
   - mysterious: 神秘系·猫系女生（慵懒、高冷、难以捉摸）

   亲和系列:
   - girl_next_door: 邻家系·男友收割机（亲切、好嫁风、无攻击性）
   - gentle_beauty: 温柔系·岁月静好（温婉、知性、书卷气）

   个性系列:
   - retro_classic: 港风系·复古女神（浓颜、复古、胶片感）
   - edgy_cool: 酷飒系·人间清醒（中性、酷帅、飒爽）
   - exotic_beauty: 混血系·异域风情（立体、深邃、异国感）

   【男性类型】
   清冷系列:
   - cold_prince: 清冷系·禁欲男神（疏离、高冷、距离感）
   - gentle_scholar: 书生系·温润如玉（儒雅、书卷气、谦谦君子）

   阳光系列:
   - warm_sunshine: 阳光系·初恋男友（温暖、干净、少年感）
   - sporty_fresh: 运动系·校草担当（阳光、健康、活力）
   - puppy_boy: 犬系·奶狗男友（粘人、可爱、撒娇）

   成熟系列:
   - mature_elite: 精英系·霸总本总（成熟、气场、事业型）
   - tough_guy: 硬汉系·荷尔蒙炸裂（阳刚、力量感、男人味）
   - gentleman: 绅士系·英伦贵族（优雅、礼貌、贵气）

   个性系列:
   - bad_boy: 痞帅系·坏男孩（痞气、不羁、危险感）
   - artistic_soul: 文艺系·忧郁诗人（文艺、敏感、故事感）
   - mysterious_wolf: 狼系·野性难驯（深邃、神秘、攻击性）

   亚洲流行:
   - korean_idol: 韩系·爱豆脸（精致、白净、偶像感）
   - japanese_soft: 日系·盐系少年（清淡、随性、舒适感）
   - retro_hong_kong: 港风系·复古男神（浓颜、复古、胶片感）

   邻家系列:
   - neighbor_brother: 邻家系·国民老公（亲切、靠谱、安全感）
   - mixed_exotic: 混血系·异域王子（立体、深邃、异国感）

2. **预测年龄 (predicted_age)**: 根据面部特征预测年龄，范围15-60岁
   - 适当往年轻方向偏（用户会更开心）

3. **颜值评分 (beauty_score)**: 0-100分
   - 80分以上为高颜值
   - 评分要有区分度，不要都给90分

4. **一句话评语 (tagline)**: 根据气质类型，用对应风格写评语
   - 清冷系/氛围感系: 诗意型（"眉间疏朗，自有清贵气"）
   - 甜美系/邻家系: 夸赞型（"笑起来像草莓味的夏天"）
   - 御姐系/个性系: 网感型（"姐的气场两米八，建议出道"）

5. **雷达图5维度 (radar)**: 每个维度包含分数和一句话解读
   - youthfulness: {score: 0-100, insight: "一句话解读，如'胶原蛋白满满'"}
   - elegance: {score: 0-100, insight: "一句话解读，如'骨相清晰有高级感'"}
   - vibe: {score: 0-100, insight: "一句话解读，如'眼神有故事'"}
   - affinity: {score: 0-100, insight: "一句话解读，如'笑容很治愈'"}
   - uniqueness: {score: 0-100, insight: "一句话解读，如'辨识度很高'"}

6. **气质雷达详细分析 (radar_detail)**: 前3个核心维度的细项分析

   **youthfulness (少女感/少年感)**:
   - score: 总分0-100
   - percentile: 同龄人对比百分位(如87表示超过87%同龄人)
   - sub_items: 4个细项
     - collagen: 胶原蛋白 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - apple_cheeks: 苹果肌 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - plumpness: 饱满度 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - skin_texture: 肌肤质感 {score: 0-100, level: "优秀/良好/一般/需改善"}
   - diagnosis: 专业诊断(如"胶原蛋白充足，苹果肌饱满，少女感十足")
   - suggestion: 针对性建议(如"继续保持良好作息，定期补充胶原蛋白")

   **elegance (高级感)**:
   - score: 总分0-100
   - percentile: 同龄人对比百分位
   - sub_items: 4个细项
     - bone_structure: 骨相 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - contour: 轮廓 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - proportions: 比例 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - refinement: 精致度 {score: 0-100, level: "优秀/良好/一般/需改善"}
   - diagnosis: 专业诊断(如"骨相清晰，轮廓分明，自带高级感滤镜")
   - suggestion: 针对性建议(如"可以尝试更简约的妆容，突出骨相优势")

   **vibe (氛围感)**:
   - score: 总分0-100
   - percentile: 同龄人对比百分位
   - sub_items: 4个细项
     - eye_expression: 眼神 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - demeanor: 神态 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - aura: 气场 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - charisma: 魅力值 {score: 0-100, level: "优秀/良好/一般/需改善"}
   - diagnosis: 专业诊断(如"眼神有故事感，神态慵懒迷人，氛围感拉满")
   - suggestion: 针对性建议(如"可以尝试更有故事感的穿搭和妆容")

6. **肤质详细分析 (metrics_detail)**: 每个维度都要包含完整的细项分析

   **skin_quality (肤质状态)**:
   - score: 总分0-100
   - percentile: 同龄人对比百分位(如87表示超过87%同龄人)
   - sub_items: 4个细项
     - luminosity: 光泽度 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - smoothness: 细腻度 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - evenness: 均匀度 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - pores: 毛孔状态 {score: 0-100, level: "优秀/良好/一般/需改善"}
   - diagnosis: 专业诊断(如"肤质整体良好，但T区毛孔略显粗大")
   - suggestion: 针对性建议(如"建议使用收敛毛孔的精华")

   **anti_aging (抗老指数)**:
   - score: 总分0-100
   - percentile: 同龄人对比百分位
   - sub_items: 4个细项
     - nasolabial: 法令纹 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - eye_area: 眼周状态 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - firmness: 紧致度 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - elasticity: 弹性 {score: 0-100, level: "优秀/良好/一般/需改善"}
   - diagnosis: 专业诊断(如"眼周有轻微细纹，整体抗老状态良好")
   - suggestion: 针对性建议(如"可以开始使用眼霜预防")

   **vitality (元气值)**:
   - score: 总分0-100
   - percentile: 同龄人对比百分位
   - sub_items: 4个细项
     - complexion: 气色 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - dark_circles: 黑眼圈 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - fatigue: 疲态 {score: 0-100, level: "优秀/良好/一般/需改善"}
     - hydration: 水润度 {score: 0-100, level: "优秀/良好/一般/需改善"}
   - diagnosis: 专业诊断(如"气色红润，但眼下有轻微黑眼圈")
   - suggestion: 针对性建议(如"建议保证充足睡眠，可用遮瑕提亮")

7. **检测到的问题 (concerns)**: 最多3个需要关注的问题点
   - 用简短的词描述，如："眼周细纹"、"肤色不均"、"毛孔粗大"、"黑眼圈"、"法令纹初现"
   - 这些问题会在免费版显示数量，制造悬念引导付费
   - 根据实际检测到的问题填写，没有问题可以少填或不填

注意：
- 评语要有小红书风格，让用户想分享
- 分数要有区分度，根据实际情况给分
- 保持娱乐性，不要太严肃
- 必须先判断性别，然后从对应性别的16种类型中选择

请严格按照JSON格式返回结果。`;

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const baseUrl = process.env.GEMINI_BASE_URL || DEFAULT_BASE_URL;
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imageFile.type;

    const ai = new GoogleGenAI({
      apiKey,
      ...(baseUrl && baseUrl !== DEFAULT_BASE_URL
        ? { httpOptions: { baseUrl } }
        : {}),
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { text: ANALYSIS_PROMPT },
        { inlineData: { mimeType, data: base64 } },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        throw new Error("Failed to parse response");
      }
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
