import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AURA_TYPES, FEMALE_AURA_TYPES, MALE_AURA_TYPES } from '@/lib/schema';
import { cn } from '@/lib/utils';

const CATEGORY_THEMES = {
  cool: {
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    text: 'text-slate-800',
    badge: 'bg-slate-100 text-slate-700',
    accent: 'bg-slate-200',
    icon: '❄️'
  },
  sweet: {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-900',
    badge: 'bg-rose-100 text-rose-700',
    accent: 'bg-rose-200',
    icon: '🌸'
  },
  queen: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-900',
    badge: 'bg-amber-100 text-amber-700',
    accent: 'bg-amber-200',
    icon: '👑'
  },
  vibe: {
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    text: 'text-violet-900',
    badge: 'bg-violet-100 text-violet-700',
    accent: 'bg-violet-200',
    icon: '✨'
  },
  warm: {
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    text: 'text-orange-900',
    badge: 'bg-orange-100 text-orange-700',
    accent: 'bg-orange-200',
    icon: '☀️'
  },
  gentle: {
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    text: 'text-teal-900',
    badge: 'bg-teal-100 text-teal-700',
    accent: 'bg-teal-200',
    icon: '🍃'
  },
  retro: {
    bg: 'bg-stone-50',
    border: 'border-stone-100',
    text: 'text-stone-800',
    badge: 'bg-stone-100 text-stone-700',
    accent: 'bg-stone-200',
    icon: '🎬'
  },
  edgy: {
    bg: 'bg-zinc-50',
    border: 'border-zinc-100',
    text: 'text-zinc-800',
    badge: 'bg-zinc-100 text-zinc-700',
    accent: 'bg-zinc-200',
    icon: '⚡'
  },
  exotic: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    text: 'text-cyan-900',
    badge: 'bg-cyan-100 text-cyan-700',
    accent: 'bg-cyan-200',
    icon: '💎'
  }
};

const AURA_TO_CATEGORY = {
  cool_goddess: 'cool',
  ice_queen: 'cool',
  cold_prince: 'cool',
  gentle_scholar: 'cool',
  sweet_first_love: 'sweet',
  cute_baby: 'sweet',
  sunny_girl: 'sweet',
  warm_sunshine: 'warm',
  sporty_fresh: 'warm',
  puppy_boy: 'sweet',
  queen_elegant: 'queen',
  boss_lady: 'queen',
  mature_charm: 'queen',
  mature_elite: 'queen',
  tough_guy: 'queen',
  gentleman: 'queen',
  pure_desire: 'vibe',
  melancholy: 'vibe',
  mysterious: 'vibe',
  artistic_soul: 'vibe',
  mysterious_wolf: 'vibe',
  girl_next_door: 'gentle',
  gentle_beauty: 'gentle',
  neighbor_brother: 'gentle',
  japanese_soft: 'gentle',
  retro_classic: 'retro',
  retro_hong_kong: 'retro',
  korean_idol: 'sweet',
  edgy_cool: 'edgy',
  bad_boy: 'edgy',
  exotic_beauty: 'exotic',
  mixed_exotic: 'exotic'
};

function getThemeForAura(auraType) {
  const category = AURA_TO_CATEGORY[auraType] || 'cool';
  return CATEGORY_THEMES[category];
}

export function ShareCard({ result, imageUrl }) {
  if (!result) return null;

  const { aura_type, aura_label, predicted_age, beauty_score, tagline, gender, concerns } = result;
  const theme = getThemeForAura(aura_type);
  const concernCount = concerns?.length || 0;

  return (
    <Card className={cn(
      "w-full max-w-[340px] mx-auto overflow-hidden shadow-xl border-0 ring-1 ring-black/5",
      theme.bg
    )}>
      <CardContent className="p-0">
        <div className="relative">
          
          <div className="relative p-8 flex flex-col items-center gap-6">
            <div className="relative group">
              <div className={cn("absolute -inset-1 rounded-full opacity-50 blur-sm transition duration-1000 group-hover:duration-200", theme.accent)}></div>
              <Avatar className="w-32 h-32 border-[3px] border-white shadow-sm relative z-10">
                {imageUrl ? (
                  <AvatarImage src={imageUrl} alt="照片" className="object-cover" />
                ) : (
                  <AvatarFallback className="text-3xl bg-white/50">📷</AvatarFallback>
                )}
              </Avatar>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "px-4 py-1 text-sm font-medium tracking-wide rounded-full border-0 shadow-none uppercase",
                  theme.badge
                )}
              >
                {theme.icon} {aura_label || AURA_TYPES[aura_type]?.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full px-4">
              <div className="text-center space-y-1">
                <div className={cn("text-3xl font-light tabular-nums tracking-tight", theme.text)}>
                  {predicted_age}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                  测龄
                </div>
              </div>
              
              <div className="relative text-center space-y-1">
                 <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-200/50"></div>
                <div className={cn("text-3xl font-light tabular-nums tracking-tight", theme.text)}>
                  {beauty_score}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                  颜值
                </div>
              </div>
            </div>

            <div className="relative py-4 px-2 w-full">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-200/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className={cn("px-2 text-gray-300", theme.bg)}>测评结果</span>
              </div>
            </div>

            <p className={cn(
              "text-center text-sm leading-relaxed text-pretty font-medium opacity-90 italic px-2",
              theme.text
            )}>
              "{tagline}"
            </p>

            {concernCount > 0 && (
              <div className="w-full mt-4 px-2">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl px-4 py-4 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <span className="text-amber-700 font-medium">
                      检测到 {concernCount} 项需关注
                    </span>
                  </div>
                  <div className="flex justify-center gap-2">
                    {concerns.map((_, i) => (
                      <div key={i} className="w-8 h-1.5 rounded-full bg-amber-300/50" />
                    ))}
                  </div>
                  <p className="text-amber-600/70 text-xs">
                    解锁完整报告查看详情与改善建议
                  </p>
                </div>
              </div>
            )}

            <div className="w-full pt-6 mt-2">
              <div className="flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <div className="h-px w-8 bg-current"></div>
                <span className="text-[10px] tracking-[0.2em] font-light uppercase">SkinScan AI</span>
                <div className="h-px w-8 bg-current"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShareCard;
