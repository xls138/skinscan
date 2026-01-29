/**
 * [INPUT]: result (分析结果), gender
 * [OUTPUT]: AuraCard 组件 (气质雷达 - 卡片2)
 * [POS]: components/AuraCard, 3卡片滑动的第二张, 气质详细解读
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { Badge } from "@/components/ui/badge";
import { RadarChart } from "@/components/RadarChart";
import { getScoreTag } from "@/lib/scoreTags";
import { cn } from "@/lib/utils";

// ============================================================================
// DIMENSION CONFIG
// ============================================================================

const DIMENSIONS = [
  { key: "youthfulness", label: "少女感", labelMale: "少年感", icon: "🌸" },
  { key: "elegance", label: "高级感", icon: "✨" },
  { key: "vibe", label: "氛围感", icon: "💫" },
  { key: "affinity", label: "亲和力", icon: "🤝" },
  { key: "uniqueness", label: "个性度", icon: "🎭" },
];

// ============================================================================
// STYLE HELPERS
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

function getBarColor(level) {
  switch (level) {
    case "high":
      return "bg-amber-400";
    case "medium":
      return "bg-blue-400";
    case "low":
      return "bg-stone-300";
    default:
      return "bg-stone-300";
  }
}

// ============================================================================
// DIMENSION ROW COMPONENT
// ============================================================================

function DimensionRow({ dimensionKey, data, gender = "female" }) {
  const config = DIMENSIONS.find((d) => d.key === dimensionKey);
  if (!config || !data) return null;

  const item = typeof data === "object" ? data : { score: data };
  const score = item?.score ?? 0;
  const tag = getScoreTag(dimensionKey, score);
  const label =
    gender === "male" && config.labelMale ? config.labelMale : config.label;

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg bg-stone-50 size-8 rounded-full flex items-center justify-center border border-stone-100 shadow-sm">
            {config.icon}
          </span>
          <span className="text-sm font-medium text-stone-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-400 tabular-nums">
            {score}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "px-2 py-0.5 text-[10px] font-medium rounded-full border shadow-none",
              getTagStyle(tag.level),
            )}
          >
            {tag.text}
          </Badge>
        </div>
      </div>

      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            getBarColor(tag.level),
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AuraCard({ result }) {
  if (!result) return null;

  const { radar, gender } = result;

  const insightText =
    [
      radar?.youthfulness?.insight,
      radar?.elegance?.insight,
      radar?.vibe?.insight,
    ]
      .filter(Boolean)
      .join("，") || "综合气质优秀，各维度表现均衡。";

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center px-4 py-5 space-y-4">
        <div className="text-center mb-1">
          <h2 className="text-sm font-medium text-stone-800 flex items-center justify-center gap-2">
            <span>⬡</span>
            气质雷达
            <span>⬡</span>
          </h2>
        </div>

        <div className="pt-3">
          <RadarChart data={radar} size={160} showDetails={false} />
        </div>

        <div className="w-full space-y-2.5 px-1">
          {DIMENSIONS.map(({ key }) => (
            <DimensionRow
              key={key}
              dimensionKey={key}
              data={radar?.[key]}
              gender={gender}
            />
          ))}
        </div>

        <div className="w-full bg-white/60 rounded-xl p-3 border border-stone-100">
          <p className="text-xs text-stone-600 leading-relaxed text-center">
            {insightText}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 opacity-40 pt-2">
          <span className="text-[10px] tracking-wide">
            ← 滑动查看肤质分析 →
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuraCard;
