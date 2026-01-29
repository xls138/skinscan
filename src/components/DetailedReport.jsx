/**
 * [INPUT]: @/components/ui/card, @/components/RadarChart, @/components/MetricDetailCard
 * [OUTPUT]: DetailedReportContent component (TabsContent only, no Tabs wrapper)
 * [POS]: components/DetailedReport - Paid tier detailed analysis report content
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { RadarChart } from "@/components/RadarChart";
import { MetricDetailCard } from "@/components/MetricDetailCard";

const RADAR_CONFIG = {
  youthfulness: {
    title: "少女感",
    titleMale: "少年感",
    icon: "🌸",
    color: "rose",
  },
  elegance: { title: "高级感", icon: "✨", color: "slate" },
  vibe: { title: "氛围感", icon: "💫", color: "violet" },
  affinity: { title: "亲和力", icon: "🤝", color: "amber" },
  uniqueness: { title: "个性度", icon: "🎭", color: "cyan" },
};

const SUB_ITEM_LABELS = {
  collagen: "胶原蛋白",
  apple_cheeks: "苹果肌",
  plumpness: "饱满度",
  skin_texture: "肌肤质感",
  bone_structure: "骨相",
  contour: "轮廓",
  proportions: "比例",
  refinement: "精致度",
  eye_expression: "眼神",
  demeanor: "神态",
  aura: "气场",
  charisma: "魅力值",
  warmth: "温暖度",
  approachability: "亲近感",
  smile: "笑容",
  openness: "开放度",
  distinctiveness: "辨识度",
  style: "风格",
  creativity: "创意",
  edge: "锐度",
};

function DimensionDetail({ dimensionKey, data, gender = "female" }) {
  if (!data) return null;

  const config = RADAR_CONFIG[dimensionKey];
  if (!config) return null;

  const title =
    gender === "male" && config.titleMale ? config.titleMale : config.title;
  const { score, sub_items, diagnosis } = data;

  return (
    <div className="bg-white rounded-xl p-3 border border-stone-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{config.icon}</span>
          <span className="text-sm font-medium text-stone-700">{title}</span>
        </div>
        <span className="text-lg font-semibold text-stone-800 tabular-nums">
          {score}
        </span>
      </div>

      {sub_items && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
          {Object.entries(sub_items)
            .slice(0, 4)
            .map(([key, item]) => (
              <div
                key={key}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-stone-500">
                  {SUB_ITEM_LABELS[key] || key}
                </span>
                <span className="text-stone-700 tabular-nums">
                  {item.score}
                </span>
              </div>
            ))}
        </div>
      )}

      {diagnosis && (
        <p className="text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-2 mt-1">
          {diagnosis}
        </p>
      )}
    </div>
  );
}

function ConcernCard({ concerns }) {
  if (!concerns?.length) return null;

  return (
    <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3">
      <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2 text-xs">
        <span>⚠️</span> 需要关注
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {concerns.map((concern, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="bg-amber-100 text-amber-700 border-0 font-normal text-[10px]"
          >
            {concern}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function DetailedReportContent({ result }) {
  if (!result) return null;

  const { radar, radar_detail, metrics_detail, concerns, gender } = result;

  return (
    <div className="h-full overflow-y-auto p-4">
      <TabsContent value="radar" className="mt-0 space-y-3">
        <div className="flex justify-center">
          <RadarChart data={radar} size={180} showDetails={false} />
        </div>

        <div className="bg-white rounded-xl p-3 border border-stone-100">
          <div className="grid grid-cols-5 gap-2 text-center mb-3">
            {[
              {
                key: "youthfulness",
                label: gender === "male" ? "少年感" : "少女感",
                icon: "🌸",
              },
              { key: "elegance", label: "高级感", icon: "✨" },
              { key: "vibe", label: "氛围感", icon: "💫" },
              { key: "affinity", label: "亲和力", icon: "🤝" },
              { key: "uniqueness", label: "个性度", icon: "🎭" },
            ].map(({ key, label, icon }) => {
              const item = radar?.[key];
              const score =
                typeof item === "object" ? item?.score : (item ?? 0);
              return (
                <div key={key}>
                  <div className="text-lg font-semibold text-stone-800 tabular-nums">
                    {score}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {icon} {label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-stone-100 pt-2">
            <p className="text-xs text-stone-600 leading-relaxed">
              {[
                radar?.youthfulness?.insight,
                radar?.elegance?.insight,
                radar?.vibe?.insight,
              ]
                .filter(Boolean)
                .join("，") || "综合气质优秀，各维度表现均衡。"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <DimensionDetail
            dimensionKey="youthfulness"
            data={radar_detail?.youthfulness}
            gender={gender}
          />
          <DimensionDetail
            dimensionKey="elegance"
            data={radar_detail?.elegance}
            gender={gender}
          />
          <DimensionDetail
            dimensionKey="vibe"
            data={radar_detail?.vibe}
            gender={gender}
          />
          <DimensionDetail
            dimensionKey="affinity"
            data={radar_detail?.affinity}
            gender={gender}
          />
          <DimensionDetail
            dimensionKey="uniqueness"
            data={radar_detail?.uniqueness}
            gender={gender}
          />
        </div>

        <ConcernCard concerns={concerns} />
      </TabsContent>

      <TabsContent value="metrics" className="mt-0 space-y-3">
        <MetricDetailCard
          metricKey="skin_quality"
          data={metrics_detail?.skin_quality}
        />
        <MetricDetailCard
          metricKey="anti_aging"
          data={metrics_detail?.anti_aging}
        />
        <MetricDetailCard
          metricKey="vitality"
          data={metrics_detail?.vitality}
        />

        <ConcernCard concerns={concerns} />
      </TabsContent>
    </div>
  );
}

export default DetailedReportContent;
