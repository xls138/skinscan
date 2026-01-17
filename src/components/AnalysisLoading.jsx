/**
 * [INPUT]: react hooks, @/components/ui/card, @/components/ui/progress
 * [OUTPUT]: AnalysisLoading component
 * [POS]: components/AnalysisLoading - Fun loading progress display
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const LOADING_STEPS = [
  { icon: '📸', text: '正在读取照片...', duration: 800 },
  { icon: '🔍', text: '识别面部特征...', duration: 1200 },
  { icon: '✨', text: '分析气质类型...', duration: 1000 },
  { icon: '📊', text: '计算各项指标...', duration: 1500 },
  { icon: '🎯', text: '生成专业诊断...', duration: 1200 },
  { icon: '📝', text: '整理分析报告...', duration: 800 }
];

const FUN_TIPS = [
  '你的笑容很有感染力呢 ✨',
  '检测到高级脸基因 💎',
  '气质雷达已启动 📡',
  '正在召唤AI分析师 🤖',
  '美丽数据加载中 📈',
  '发现了一些亮点 ⭐',
  '专业报告生成中 📋'
];

export function AnalysisLoading({ isLoading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(FUN_TIPS[0]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    setTip(FUN_TIPS[Math.floor(Math.random() * FUN_TIPS.length)]);

    let totalDuration = LOADING_STEPS.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      
      let stepElapsed = 0;
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        stepElapsed += LOADING_STEPS[i].duration;
        if (elapsed < stepElapsed) {
          stepIndex = i;
          break;
        }
        stepIndex = LOADING_STEPS.length - 1;
      }
      
      setCurrentStep(stepIndex);
      setProgress(Math.min((elapsed / totalDuration) * 100, 95));

      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  const step = LOADING_STEPS[currentStep];

  return (
    <Card className="w-full max-w-[340px] mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center animate-pulse">
            <span className="text-3xl">{step.icon}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-stone-800 font-medium">{step.text}</p>
          <p className="text-xs text-stone-400">{tip}</p>
        </div>

        <div className="w-full space-y-2">
          <Progress value={progress} className="h-2 bg-stone-100" />
          <div className="flex justify-between text-xs text-stone-400">
            <span>步骤 {currentStep + 1}/{LOADING_STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="flex gap-1.5">
          {LOADING_STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i <= currentStep ? "bg-stone-800" : "bg-stone-200"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default AnalysisLoading;
