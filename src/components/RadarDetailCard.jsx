/**
 * [INPUT]: @/components/ui/card, @/components/ui/progress, @/components/ui/badge
 * [OUTPUT]: RadarDetailCard component
 * [POS]: components/RadarDetailCard - Single radar dimension detailed analysis card
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RADAR_CONFIG = {
  youthfulness: {
    title: '少女感',
    titleMale: '少年感',
    icon: '🌸',
    color: 'rose',
    subItemLabels: {
      collagen: '胶原蛋白',
      apple_cheeks: '苹果肌',
      plumpness: '饱满度',
      skin_texture: '肌肤质感'
    }
  },
  elegance: {
    title: '高级感',
    titleMale: '高级感',
    icon: '✨',
    color: 'slate',
    subItemLabels: {
      bone_structure: '骨相',
      contour: '轮廓',
      proportions: '比例',
      refinement: '精致度'
    }
  },
  vibe: {
    title: '氛围感',
    titleMale: '氛围感',
    icon: '💫',
    color: 'violet',
    subItemLabels: {
      eye_expression: '眼神',
      demeanor: '神态',
      aura: '气场',
      charisma: '魅力值'
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
  rose: {
    progress: 'bg-rose-400',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-900'
  },
  slate: {
    progress: 'bg-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    text: 'text-slate-900'
  },
  violet: {
    progress: 'bg-violet-400',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    text: 'text-violet-900'
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

export function RadarDetailCard({ radarKey, data, gender = 'female' }) {
  if (!data) return null;

  const config = RADAR_CONFIG[radarKey];
  const colors = COLOR_VARIANTS[config.color];
  const { score, percentile, sub_items, diagnosis, suggestion } = data;
  const title = gender === 'male' && config.titleMale ? config.titleMale : config.title;

  return (
    <Card className={cn("border overflow-hidden", colors.border)}>
      <CardHeader className={cn("py-4 px-5", colors.bg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span className={cn("font-medium", colors.text)}>{title}</span>
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
          
          <div className={cn("rounded-lg p-3 border", colors.bg, colors.border)}>
            <div className={cn("text-xs mb-1", colors.text)}>💡 建议</div>
            <p className={cn("text-sm leading-relaxed", colors.text)}>{suggestion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RadarDetailCard;
