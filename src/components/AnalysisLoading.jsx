/**
 * [INPUT]: react hooks, @/components/ui/card, @/components/ui/progress
 * [OUTPUT]: AnalysisLoading component
 * [POS]: components/AnalysisLoading - Fun loading progress with psychological hooks
 * [UPDATE]: remove isLoading reset; rely on mount/unmount
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
  { icon: "📸", text: "读取照片中...", subtext: "高清像素解析" },
  { icon: "🔍", text: "识别面部特征...", subtext: "68个关键点定位" },
  { icon: "✨", text: "分析气质类型...", subtext: "32种气质匹配" },
  { icon: "📊", text: "计算各项指标...", subtext: "5维雷达生成" },
  { icon: "🎯", text: "生成专业诊断...", subtext: "肤质深度分析" },
  { icon: "📝", text: "整理分析报告...", subtext: "即将揭晓结果" },
];

const TEASER_MESSAGES = [
  { type: "positive", text: "检测到优质基因 💎" },
  { type: "positive", text: "气质数据表现亮眼 ⭐" },
  { type: "neutral", text: "正在匹配最佳类型..." },
  { type: "suspense", text: "发现了一些有趣的特征 🔮" },
  { type: "positive", text: "颜值数据加载完成 ✓" },
];

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [teaser, setTeaser] = useState(null);
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    const totalDuration = 6500;
    const stepDuration = totalDuration / LOADING_STEPS.length;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;

      const stepIndex = Math.min(
        Math.floor(elapsed / stepDuration),
        LOADING_STEPS.length - 1,
      );

      setCurrentStep(stepIndex);
      setProgress(Math.min((elapsed / totalDuration) * 100, 95));

      if (elapsed === 2000 || elapsed === 4000) {
        const msg =
          TEASER_MESSAGES[Math.floor(Math.random() * TEASER_MESSAGES.length)];
        setTeaser(msg);
        setShowTeaser(true);
        setTimeout(() => setShowTeaser(false), 1500);
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const step = LOADING_STEPS[currentStep];

  return (
    <Card className="w-full max-w-85 mx-auto border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-stone-100 to-stone-50 flex items-center justify-center shadow-inner">
            <span className="text-4xl animate-bounce">{step.icon}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">
              {currentStep + 1}
            </span>
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-stone-800 font-medium text-lg">{step.text}</p>
          <p className="text-xs text-stone-400">{step.subtext}</p>
        </div>

        <div
          className={cn(
            "h-8 flex items-center justify-center transition-all duration-300",
            showTeaser
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2",
          )}
        >
          {teaser && (
            <span
              className={cn(
                "text-sm font-medium px-4 py-1.5 rounded-full",
                teaser.type === "positive" && "bg-emerald-50 text-emerald-600",
                teaser.type === "suspense" && "bg-amber-50 text-amber-600",
                teaser.type === "neutral" && "bg-stone-100 text-stone-600",
              )}
            >
              {teaser.text}
            </span>
          )}
        </div>

        <div className="w-full space-y-3">
          <Progress value={progress} className="h-2 bg-stone-100" />
          <div className="flex justify-between text-xs">
            <span className="text-stone-500 font-medium">
              步骤 {currentStep + 1} / {LOADING_STEPS.length}
            </span>
            <span className="text-stone-400 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {LOADING_STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                i < currentStep && "bg-emerald-500",
                i === currentStep && "bg-stone-800 scale-125",
                i > currentStep && "bg-stone-200",
              )}
            />
          ))}
        </div>

        <p className="text-[10px] text-stone-300 text-center">
          AI 正在深度分析你的面部特征...
        </p>
      </CardContent>
    </Card>
  );
}

export default AnalysisLoading;
