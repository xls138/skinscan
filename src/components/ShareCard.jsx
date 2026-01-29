/**
 * [INPUT]: result (分析结果), imageUrl (用户图片), onReset
 * [OUTPUT]: ShareCard 组件 (3:4 比例结果卡片, 3卡片横向滑动)
 * [POS]: components/ShareCard, 核心结果展示组件, 适配户外机器
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AURA_TYPES } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { SummaryCard } from "@/components/SummaryCard";
import { AuraCard } from "@/components/AuraCard";
import { SkinCard } from "@/components/SkinCard";
import { DetailedReportContent } from "@/components/DetailedReport";
import { RotateCcw } from "lucide-react";

// ============================================================================
// THEME CONFIG
// ============================================================================

const CATEGORY_THEMES = {
  cool: {
    bg: "bg-slate-50",
    border: "border-slate-100",
    text: "text-slate-800",
    badge: "bg-slate-100 text-slate-700",
    accent: "bg-slate-200",
    icon: "❄️",
  },
  sweet: {
    bg: "bg-rose-50",
    border: "border-rose-100",
    text: "text-rose-900",
    badge: "bg-rose-100 text-rose-700",
    accent: "bg-rose-200",
    icon: "🌸",
  },
  queen: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-700",
    accent: "bg-amber-200",
    icon: "👑",
  },
  vibe: {
    bg: "bg-violet-50",
    border: "border-violet-100",
    text: "text-violet-900",
    badge: "bg-violet-100 text-violet-700",
    accent: "bg-violet-200",
    icon: "✨",
  },
  warm: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-900",
    badge: "bg-orange-100 text-orange-700",
    accent: "bg-orange-200",
    icon: "☀️",
  },
  gentle: {
    bg: "bg-teal-50",
    border: "border-teal-100",
    text: "text-teal-900",
    badge: "bg-teal-100 text-teal-700",
    accent: "bg-teal-200",
    icon: "🍃",
  },
  retro: {
    bg: "bg-stone-50",
    border: "border-stone-100",
    text: "text-stone-800",
    badge: "bg-stone-100 text-stone-700",
    accent: "bg-stone-200",
    icon: "🎬",
  },
  edgy: {
    bg: "bg-zinc-50",
    border: "border-zinc-100",
    text: "text-zinc-800",
    badge: "bg-zinc-100 text-zinc-700",
    accent: "bg-zinc-200",
    icon: "⚡",
  },
  exotic: {
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    text: "text-cyan-900",
    badge: "bg-cyan-100 text-cyan-700",
    accent: "bg-cyan-200",
    icon: "💎",
  },
};

const AURA_TO_CATEGORY = {
  cool_goddess: "cool",
  ice_queen: "cool",
  cold_prince: "cool",
  gentle_scholar: "cool",
  sweet_first_love: "sweet",
  cute_baby: "sweet",
  sunny_girl: "sweet",
  warm_sunshine: "warm",
  sporty_fresh: "warm",
  puppy_boy: "sweet",
  queen_elegant: "queen",
  boss_lady: "queen",
  mature_charm: "queen",
  mature_elite: "queen",
  tough_guy: "queen",
  gentleman: "queen",
  pure_desire: "vibe",
  melancholy: "vibe",
  mysterious: "vibe",
  artistic_soul: "vibe",
  mysterious_wolf: "vibe",
  girl_next_door: "gentle",
  gentle_beauty: "gentle",
  neighbor_brother: "gentle",
  japanese_soft: "gentle",
  retro_classic: "retro",
  retro_hong_kong: "retro",
  korean_idol: "sweet",
  edgy_cool: "edgy",
  bad_boy: "edgy",
  exotic_beauty: "exotic",
  mixed_exotic: "exotic",
};

function getThemeForAura(auraType) {
  const category = AURA_TO_CATEGORY[auraType] || "cool";
  return CATEGORY_THEMES[category];
}

// ============================================================================
// DOT INDICATOR COMPONENT
// ============================================================================

function DotIndicator({ count, activeIndex, onDotClick }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={cn(
            "size-2 rounded-full transition-all",
            i === activeIndex
              ? "bg-stone-800 w-4"
              : "bg-stone-300 hover:bg-stone-400",
          )}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ShareCard({ result, imageUrl, onReset }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < 3) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  const scrollToIndex = useCallback((index) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth;
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleUnlock = () => {
    setIsPaid(true);
  };

  if (!result) return null;

  const { aura_type } = result;
  const theme = getThemeForAura(aura_type);

  if (isPaid) {
    return (
      <Card
        className={cn(
          "h-[calc(100dvh-3rem)] w-[calc((100dvh-3rem)*3/4)] mx-auto overflow-hidden shadow-2xl border-0 ring-1 ring-black/5 relative bg-white",
        )}
      >
        {onReset && (
          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 size-10 rounded-full bg-stone-100/80 hover:bg-stone-200 text-stone-500 hover:text-stone-700"
          >
            <RotateCcw className="size-5" />
          </Button>
        )}

        <CardContent className="p-0 h-full flex flex-col">
          <Tabs defaultValue="radar" className="w-full h-full flex flex-col">
            <div className="flex-none px-4 pt-6 pb-2 bg-white z-10">
              <h2 className="text-center font-semibold text-stone-800 mb-4">
                详细分析报告
              </h2>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="radar">气质雷达</TabsTrigger>
                <TabsTrigger value="metrics">肤质数据</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <DetailedReportContent result={result} />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-[calc(100dvh-3rem)] w-[calc((100dvh-3rem)*3/4)] mx-auto overflow-hidden shadow-2xl border-0 ring-1 ring-black/5 relative",
        theme.bg,
      )}
    >
      {onReset && (
        <Button
          onClick={onReset}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 size-10 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-700 shadow-sm"
        >
          <RotateCcw className="size-5" />
        </Button>
      )}

      <CardContent className="p-0 h-full flex flex-col">
        <div
          ref={scrollContainerRef}
          className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <div className="shrink-0 w-full h-full snap-center">
            <SummaryCard result={result} imageUrl={imageUrl} theme={theme} />
          </div>

          <div className={cn("shrink-0 w-full h-full snap-center", theme.bg)}>
            <AuraCard result={result} />
          </div>

          <div className={cn("shrink-0 w-full h-full snap-center", theme.bg)}>
            <SkinCard result={result} onUnlock={handleUnlock} />
          </div>
        </div>

        <DotIndicator
          count={3}
          activeIndex={activeIndex}
          onDotClick={scrollToIndex}
        />
      </CardContent>
    </Card>
  );
}

export default ShareCard;
