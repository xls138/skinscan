/**
 * [INPUT]: result (分析结果)
 * [OUTPUT]: SkinCard 组件 (肤质分析 - 卡片3)
 * [POS]: components/SkinCard, 3卡片滑动的第三张, 肤质+付费入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lock, ChevronRight, Check, Gift } from 'lucide-react';

// ============================================================================
// METRIC CONFIG
// ============================================================================

const METRICS = [
  { key: 'skin_quality', label: '肤质状态', icon: '✨', color: 'amber' },
  { key: 'anti_aging', label: '抗老指数', icon: '💧', color: 'sky' },
  { key: 'vitality', label: '元气值', icon: '🌿', color: 'emerald' }
];

const COLOR_VARIANTS = {
  amber: 'bg-amber-500',
  sky: 'bg-sky-500',
  emerald: 'bg-emerald-500'
};

// ============================================================================
// METRIC ROW COMPONENT
// ============================================================================

function MetricRow({ metricKey, data }) {
  const config = METRICS.find(m => m.key === metricKey);
  if (!config || !data) return null;

  const score = data?.score ?? 0;
  const barColor = COLOR_VARIANTS[config.color];
  
  const headerColors = {
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };

  const headerStyle = headerColors[config.color] || 'bg-stone-50 text-stone-700 border-stone-100';

  return (
    <div className="bg-white rounded-xl p-3 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={cn("size-8 rounded-lg flex items-center justify-center text-lg border", headerStyle)}>
            {config.icon}
          </div>
          <span className="text-sm font-medium text-stone-700">{config.label}</span>
        </div>
        <span className="text-lg font-bold text-stone-800 tabular-nums">
          {score}
        </span>
      </div>
      
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SkinCard({ result, onUnlock }) {
  if (!result) return null;

  const { metrics_detail, concerns } = result;

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col px-4 py-5 space-y-4">
        <div className="text-center mb-1">
          <h2 className="text-sm font-medium text-stone-800 flex items-center justify-center gap-2">
            <span>🧴</span>
            肤质分析
          </h2>
        </div>

        <div className="w-full bg-white rounded-xl p-4 border border-stone-100 space-y-3">
          {METRICS.map(({ key }) => (
            <MetricRow 
              key={key} 
              metricKey={key} 
              data={metrics_detail?.[key]} 
            />
          ))}
        </div>

        {concerns?.length > 0 && (
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
        )}

        <div className="flex-1" />

        <div className="bg-stone-800 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 size-32 bg-amber-400/10 rounded-full -translate-y-8 translate-x-8" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="size-4 text-amber-400" />
              <span className="font-medium">获取专属护肤方案</span>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-stone-300">
                <Check className="size-3.5 text-emerald-400" />
                <span>5维度气质深度解读</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Check className="size-3.5 text-emerald-400" />
                <span>专属护肤产品推荐</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <Gift className="size-3.5" />
                <span className="font-medium">商家 ¥50 优惠券</span>
              </div>
            </div>
            
            <Button
              onClick={onUnlock}
              className="w-full h-11 rounded-xl bg-amber-400 text-stone-900 hover:bg-amber-300 font-medium group"
            >
              <span>¥9.9 解锁</span>
              <ChevronRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 opacity-40">
          <div className="h-px w-8 bg-current" />
          <span className="text-[10px] tracking-[0.2em] font-light uppercase">SkinScan AI</span>
          <div className="h-px w-8 bg-current" />
        </div>
      </div>
    </div>
  );
}

export default SkinCard;
