/**
 * Score tag helpers shared across components.
 */
const DIMENSION_TAGS = {
  youthfulness: {
    high: ["胶原蛋白爆棚✨", "满满少女感", "肌肤饱满"],
    medium: ["胶原蛋白在线", "少女感不错", "肌肤状态良好"],
    low: ["胶原蛋白待补充", "少女感待提升"],
  },
  elegance: {
    high: ["骨相绝美", "高级感拉满", "轮廓分明"],
    medium: ["骨相清晰", "气质在线", "轮廓不错"],
    low: ["骨相待雕刻", "高级感待提升"],
  },
  vibe: {
    high: ["眼神有故事", "氛围感绝了", "魅力值爆表"],
    medium: ["眼神有神", "氛围感不错", "魅力在线"],
    low: ["氛围感待培养", "魅力待释放"],
  },
  affinity: {
    high: ["笑容超治愈", "亲和力满分", "让人想靠近"],
    medium: ["笑容亲切", "亲和力在线", "气质温和"],
    low: ["亲和力待提升", "可以多笑笑"],
  },
  uniqueness: {
    high: ["辨识度极高", "风格独特", "过目不忘"],
    medium: ["辨识度不错", "有个人特色"],
    low: ["辨识度待提升", "可以更独特"],
  },
};

/**
 * Get descriptive tag based on score.
 * @param {string} dimension - Dimension key
 * @param {number} score - Score value (0-100)
 * @returns {{ text: string, level: 'high' | 'medium' | 'low' }}
 */
export function getScoreTag(dimension, score) {
  const tags = DIMENSION_TAGS[dimension];
  if (!tags) return { text: "", level: "medium" };

  let level;
  let tagList;
  if (score >= 85) {
    level = "high";
    tagList = tags.high;
  } else if (score >= 70) {
    level = "medium";
    tagList = tags.medium;
  } else {
    level = "low";
    tagList = tags.low;
  }

  const text = tagList[Math.floor(Math.random() * tagList.length)];
  return { text, level };
}

/**
 * Get top N highlight tags from radar data.
 * @param {Object} radar - Radar data object
 * @param {number} count - Number of tags to return
 * @returns {Array<{text: string, level: string, dimension: string}>}
 */
export function getHighlightTags(radar, count = 4) {
  if (!radar) return [];

  const dimensions = [
    "youthfulness",
    "elegance",
    "vibe",
    "affinity",
    "uniqueness",
  ];

  const scored = dimensions
    .map((dim) => {
      const item = radar[dim];
      const score = typeof item === "object" ? item?.score : (item ?? 0);
      return { dimension: dim, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map(({ dimension, score }) => ({
    ...getScoreTag(dimension, score),
    dimension,
  }));
}
