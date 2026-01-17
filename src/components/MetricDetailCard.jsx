/**
 * [INPUT]: @/components/ui/card, @/components/ui/progress, @/components/ui/badge
 * [OUTPUT]: MetricDetailCard component
 * [POS]: components/MetricDetailCard - Single metric detailed analysis card
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const METRIC_CONFIG = {
  skin_quality: {
    title: '肤质状态',
    icon: '✨',
    color: 'amber',
    subItemLabels: {
      luminosity: '光泽度',
      smoothness: '细腻度',
      evenness: '均匀度',
      pores: '毛孔状态'
    }
  },
  anti_aging: {
    title: '抗老指数',
    icon: '💧',
    color: 'sky',
    subItemLabels: {
      nasolabial: '法令纹',
      eye_area: '眼周状态',
      firmness: '紧致度',
      elasticity: '弹性'
    }
  },
  vitality: {
    title: '元气值',
    icon: '🌿',
    color: 'emerald',
    subItemLabels: {
      complexion: '气色',
      dark_circles: '黑眼圈',
      fatigue: '疲态',
      hydration: '水润度'
    }
  }
};

const LEVEL_STYLES = {
  '优秀': 'bg-emerald-100 text-emerald-700',
  '良好': 'bg-sky-100 text-sky-700',
  '一般': 'bg-amber-100 text-amber-700',
  '需改善': 'bg-rose-100 text-rose-700'
};

const COLOR_VARIANTS = {
  amber: {
    progress: 'bg-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-900'
  },
  sky: {
    progress: 'bg-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    text: 'text-sky-900'
  },
  emerald: {
    progress: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-900'
  }
};

function SubItemRow({ label, score, level }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-stone-600">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-20">
          <Progress value={score} className="h-1.5 bg-stone-100" />
        </div>
        <Badge 
          variant="secondary" 
          className={cn("text-xs font-normal px-2 py-0.5 border-0", LEVEL_STYLES[level])}
        >
          {level}
        </Badge>
      </div>
    </div>
  );
}

export function MetricDetailCard({ metricKey, data }) {
  if (!data) return null;

  const config = METRIC_CONFIG[metricKey];
  const colors = COLOR_VARIANTS[config.color];
  const { score, percentile, sub_items, diagnosis, suggestion } = data;

  return (
    <Card className={cn("border overflow-hidden", colors.border)}>
      <CardHeader className={cn("py-4 px-5", colors.bg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span className={cn("font-medium", colors.text)}>{config.title}</span>
          </div>
          <div className="text-right">
            <div className={cn("text-2xl font-semibold tabular-nums", colors.text)}>
              {score}
            </div>
            <div className="text-xs text-stone-400">
              超过 {percentile}% 同龄人
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 space-y-4">
        <div className="divide-y divide-stone-100">
          {Object.entries(sub_items).map(([key, item]) => (
            <SubItemRow
              key={key}
              label={config.subItemLabels[key]}
              score={item.score}
              level={item.level}
            />
          ))}
        </div>

        <div className="pt-3 space-y-3">
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-400 mb-1">专业诊断</div>
            <p className="text-sm text-stone-700 leading-relaxed">{diagnosis}</p>
          </div>
          
          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100/50">
            <div className="text-xs text-amber-600 mb-1">💡 建议</div>
            <p className="text-sm text-amber-800 leading-relaxed">{suggestion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MetricDetailCard;
