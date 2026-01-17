import { Progress } from '@/components/ui/progress';

const METRIC_CONFIG = {
  skin_quality: { label: '肤质状态', icon: '✨', color: 'bg-emerald-400' },
  anti_aging: { label: '抗老指数', icon: '💧', color: 'bg-rose-400' },
  vitality: { label: '元气值', icon: '🌿', color: 'bg-amber-400' }
};

function getScoreLevel(score) {
  if (score >= 80) return { text: '优秀', class: 'text-emerald-600' };
  if (score >= 60) return { text: '良好', class: 'text-sky-600' };
  if (score >= 40) return { text: '一般', class: 'text-amber-600' };
  return { text: '需改善', class: 'text-rose-600' };
}

export function MetricBar({ metricKey, value }) {
  const config = METRIC_CONFIG[metricKey];
  if (!config) return null;

  const level = getScoreLevel(value);

  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="opacity-70 text-xs">{config.icon}</span>
          <span className="text-sm font-medium text-stone-700">{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium uppercase tracking-wider ${level.class}`}>{level.text}</span>
          <span className="text-sm font-bold text-stone-800 tabular-nums">{value}</span>
        </div>
      </div>
      <Progress value={value} className="h-1.5 bg-stone-100" indicatorClassName={config.color} />
    </div>
  );
}

export function MetricList({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="space-y-5 px-1">
      {Object.entries(METRIC_CONFIG).map(([key]) => (
        <MetricBar key={key} metricKey={key} value={metrics[key] ?? 0} />
      ))}
    </div>
  );
}

export default MetricList;
