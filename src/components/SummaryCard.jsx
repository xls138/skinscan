/**
 * [INPUT]: result (分析结果), imageUrl (用户图片), theme (主题配置)
 * [OUTPUT]: SummaryCard 组件 (Hero 分享图 - 卡片1)
 * [POS]: components/SummaryCard, 3卡片滑动的第一张, 主分享图
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { Badge } from '@/components/ui/badge';
import { AURA_TYPES } from '@/lib/schema';
import { cn } from '@/lib/utils';

// ============================================================================
// SCORE TO TAG MAPPING
// ============================================================================

const DIMENSION_TAGS = {
  youthfulness: {
    high: ['胶原蛋白爆棚✨', '满满少女感', '肌肤饱满'],
    medium: ['胶原蛋白在线', '少女感不错', '肌肤状态良好'],
    low: ['胶原蛋白待补充', '少女感待提升']
  },
  elegance: {
    high: ['骨相绝美', '高级感拉满', '轮廓分明'],
    medium: ['骨相清晰', '气质在线', '轮廓不错'],
    low: ['骨相待雕刻', '高级感待提升']
  },
  vibe: {
    high: ['眼神有故事', '氛围感绝了', '魅力值爆表'],
    medium: ['眼神有神', '氛围感不错', '魅力在线'],
    low: ['氛围感待培养', '魅力待释放']
  },
  affinity: {
    high: ['笑容超治愈', '亲和力满分', '让人想靠近'],
    medium: ['笑容亲切', '亲和力在线', '气质温和'],
    low: ['亲和力待提升', '可以多笑笑']
  },
  uniqueness: {
    high: ['辨识度极高', '风格独特', '过目不忘'],
    medium: ['辨识度不错', '有个人特色'],
    low: ['辨识度待提升', '可以更独特']
  }
};

/**
 * Get descriptive tag based on score
 * @param {string} dimension - Dimension key
 * @param {number} score - Score value (0-100)
 * @returns {{ text: string, level: 'high' | 'medium' | 'low' }}
 */
export function getScoreTag(dimension, score) {
  const tags = DIMENSION_TAGS[dimension];
  if (!tags) return { text: '', level: 'medium' };
  
  let level, tagList;
  if (score >= 85) {
    level = 'high';
    tagList = tags.high;
  } else if (score >= 70) {
    level = 'medium';
    tagList = tags.medium;
  } else {
    level = 'low';
    tagList = tags.low;
  }
  
  const text = tagList[Math.floor(Math.random() * tagList.length)];
  return { text, level };
}

/**
 * Get top N highlight tags from radar data
 * @param {Object} radar - Radar data object
 * @param {number} count - Number of tags to return
 * @returns {Array<{text: string, level: string, dimension: string}>}
 */
export function getHighlightTags(radar, count = 4) {
  if (!radar) return [];
  
  const dimensions = ['youthfulness', 'elegance', 'vibe', 'affinity', 'uniqueness'];
  
  const scored = dimensions
    .map(dim => {
      const item = radar[dim];
      const score = typeof item === 'object' ? item?.score : item ?? 0;
      return { dimension: dim, score };
    })
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, count).map(({ dimension, score }) => ({
    ...getScoreTag(dimension, score),
    dimension
  }));
}

// ============================================================================
// TAG STYLE HELPERS
// ============================================================================

function getTagStyle(level) {
  switch (level) {
    case 'high':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'medium':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'low':
      return 'bg-stone-100 text-stone-500 border-stone-200';
    default:
      return 'bg-stone-100 text-stone-600 border-stone-200';
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SummaryCard({ result, imageUrl, theme }) {
  if (!result) return null;

  const { aura_type, aura_label, predicted_age, beauty_score, tagline, radar } = result;
  
  const percentile = Math.min(99, Math.max(1, Math.round(beauty_score * 0.95)));
  const highlightTags = getHighlightTags(radar, 4);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Photo Section - 55% */}
      <div className="flex-[55] min-h-0 relative overflow-hidden">
        <img
          src={imageUrl}
          alt="Your photo"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90" />
      </div>

      {/* Content Section - 45% */}
      <div className="flex-[45] flex flex-col items-center justify-evenly py-4 px-5">
        {/* Aura Type Badge */}
        <Badge 
          variant="secondary" 
          className={cn(
            "px-5 py-1.5 text-base font-medium tracking-wide rounded-full border-0 shadow-none",
            theme.badge
          )}
        >
          {theme.icon} {aura_label || AURA_TYPES[aura_type]?.label}
        </Badge>

        {/* Tagline */}
        <p className={cn(
          "text-center text-sm leading-relaxed text-pretty font-medium opacity-90 italic px-4 max-w-[95%]",
          theme.text
        )}>
          "{tagline}"
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-6 w-full">
          <div className="text-center">
            <div className={cn("text-4xl font-light tabular-nums tracking-tight", theme.text)}>
              {predicted_age}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">
              测龄
            </div>
          </div>
          
          <div className="w-px h-12 bg-gray-200/50" />
          
          <div className="text-center">
            <div className={cn("text-4xl font-light tabular-nums tracking-tight", theme.text)}>
              {beauty_score}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">
              颜值
            </div>
          </div>
          
          <div className="w-px h-12 bg-gray-200/50" />
          
          <div className="text-center">
            <div className={cn("text-4xl font-light tabular-nums tracking-tight", theme.text)}>
              <span className="text-2xl">Top</span> {100 - percentile}%
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">
              超过
            </div>
          </div>
        </div>

        {/* Highlight Tags Cloud */}
        <div className="flex flex-wrap justify-center gap-2 px-2">
          {highlightTags.map((tag, i) => (
            <Badge
              key={i}
              variant="outline"
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full border",
                getTagStyle(tag.level)
              )}
            >
              {tag.text}
            </Badge>
          ))}
        </div>

        {/* Swipe Hint */}
        <div className="flex items-center justify-center gap-2 opacity-40">
          <span className="text-[10px] tracking-wide">← 滑动查看详细解读 →</span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
