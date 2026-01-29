/**
 * [INPUT]: result (分析结果), imageUrl (用户图片), theme (主题配置)
 * [OUTPUT]: SummaryCard 组件 (Hero 分享图 - 卡片1)
 * [POS]: components/SummaryCard, 3卡片滑动的第一张, 主分享图
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { Badge } from "@/components/ui/badge";
import { AURA_TYPES } from "@/lib/schema";
import { getHighlightTags } from "@/lib/scoreTags";
import { cn } from "@/lib/utils";

// ============================================================================
// TAG STYLE HELPERS
// ============================================================================

function getTagStyle(level) {
  switch (level) {
    case "high":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "medium":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "low":
      return "bg-stone-100 text-stone-500 border-stone-200";
    default:
      return "bg-stone-100 text-stone-600 border-stone-200";
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SummaryCard({ result, imageUrl, theme }) {
  if (!result) return null;

  const { aura_type, aura_label, predicted_age, beauty_score, tagline, radar } =
    result;

  const percentile = Math.min(99, Math.max(1, Math.round(beauty_score * 0.95)));
  const highlightTags = getHighlightTags(radar, 4);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Photo Section - 55% */}
      <div className="flex-55 min-h-0 relative overflow-hidden">
        <img
          src={imageUrl}
          alt="Your photo"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90" />
      </div>

      {/* Content Section - 45% */}
      <div className="flex-45 flex flex-col items-center justify-evenly py-4 px-5">
        {/* Aura Type Badge */}
        <Badge
          variant="secondary"
          className={cn(
            "px-5 py-1.5 text-base font-medium tracking-wide rounded-full border-0 shadow-none",
            theme.badge,
          )}
        >
          {theme.icon} {aura_label || AURA_TYPES[aura_type]?.label}
        </Badge>

        {/* Tagline */}
        <p
          className={cn(
            "text-center text-sm leading-relaxed text-pretty font-medium opacity-90 italic px-4 max-w-[95%]",
            theme.text,
          )}
        >
          "{tagline}"
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-6 w-full">
          <div className="text-center">
            <div
              className={cn(
                "text-4xl font-light tabular-nums tracking-tight",
                theme.text,
              )}
            >
              {predicted_age}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">
              测龄
            </div>
          </div>

          <div className="w-px h-12 bg-gray-200/50" />

          <div className="text-center">
            <div
              className={cn(
                "text-4xl font-light tabular-nums tracking-tight",
                theme.text,
              )}
            >
              {beauty_score}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">
              颜值
            </div>
          </div>

          <div className="w-px h-12 bg-gray-200/50" />

          <div className="text-center">
            <div
              className={cn(
                "text-4xl font-light tabular-nums tracking-tight",
                theme.text,
              )}
            >
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
                getTagStyle(tag.level),
              )}
            >
              {tag.text}
            </Badge>
          ))}
        </div>

        {/* Swipe Hint */}
        <div className="flex items-center justify-center gap-2 opacity-40">
          <span className="text-[10px] tracking-wide">
            ← 滑动查看详细解读 →
          </span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
