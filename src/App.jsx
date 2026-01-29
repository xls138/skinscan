/**
 * [INPUT]: 依赖 ShareCard, gemini (analyzeFace)
 * [OUTPUT]: 对外提供 App 组件 (主应用入口)
 * [POS]: src/App.jsx, 应用根组件, 处理路由和状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/CameraCapture";
import { ShareCard } from "@/components/ShareCard";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { FaceAnalysisOverlay } from "@/components/FaceAnalysisOverlay";
import { analyzeFace } from "@/lib/gemini";

function App() {
  const [mode, setMode] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleAnalyze = useCallback(async (file, url) => {
    setImageUrl(url);
    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const analysisResult = await analyzeFace(file);
      setResult(analysisResult);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message || "分析失败，请重试");
      setMode(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;

      const url = URL.createObjectURL(file);
      handleAnalyze(file, url);
    },
    [handleAnalyze],
  );

  const handleReset = useCallback(() => {
    setMode(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
  }, []);

  const renderEntryScreen = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 pt-4">
        <p className="text-stone-600 text-sm leading-relaxed max-w-70 mx-auto">
          AI 智能分析你的颜值气质类型
          <br />
          <span className="text-stone-400">32种气质分类 · 专业肤质诊断</span>
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => setMode("camera")}
          size="lg"
          className="w-full h-14 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all active:scale-[0.98] text-base"
        >
          <span className="mr-2">📸</span>
          拍照测评
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          size="lg"
          variant="outline"
          className="w-full h-14 rounded-2xl border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all active:scale-[0.98] text-base"
        >
          <span className="mr-2">🖼️</span>
          上传照片
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4">
        {[
          { icon: "✨", label: "气质雷达", desc: "5维度分析" },
          { icon: "🎯", label: "精准测龄", desc: "AI智能预测" },
          { icon: "💎", label: "肤质诊断", desc: "专业级报告" },
        ].map((item, i) => (
          <div
            key={i}
            className="text-center p-3 rounded-xl bg-white/60 border border-stone-100"
          >
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-xs font-medium text-stone-700">
              {item.label}
            </div>
            <div className="text-[10px] text-stone-400">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-stone-300">
          已有 <span className="text-stone-400 font-medium">128,000+</span>{" "}
          人完成测评
        </p>
      </div>
    </div>
  );

  const renderCameraMode = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <CameraCapture onCapture={handleAnalyze} isLoading={isLoading} />

      {!isLoading && (
        <div className="text-center">
          <Button
            onClick={() => setMode(null)}
            variant="ghost"
            size="sm"
            className="text-stone-400 hover:text-stone-600"
          >
            ← 返回
          </Button>
        </div>
      )}
    </div>
  );

  if (result) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-stone-100 p-6 animate-in fade-in duration-500">
        <ShareCard result={result} imageUrl={imageUrl} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-linear-to-b from-stone-50 to-stone-100 text-stone-900 selection:bg-rose-200/50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <header className="text-center mb-8 space-y-2">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-2">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            SkinScan AI
          </h1>
          <p className="text-stone-400 text-xs tracking-widest uppercase">
            颜值气质测评
          </p>
        </header>

        {error && (
          <div className="mb-6 text-center text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in">
            {error}
            <Button
              onClick={handleReset}
              variant="ghost"
              size="sm"
              className="mt-2 text-red-400"
            >
              重试
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <FaceAnalysisOverlay imageUrl={imageUrl} />
            <AnalysisLoading />
          </div>
        ) : mode === "camera" ? (
          renderCameraMode()
        ) : (
          renderEntryScreen()
        )}

        <footer className="text-center mt-8 text-[10px] text-stone-300 tracking-wide">
          <p>仅供娱乐 · 结果不代表专业医学诊断</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
