import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ImageUpload';
import { ShareCard } from '@/components/ShareCard';
import { DetailedReport } from '@/components/DetailedReport';
import { AnalysisLoading } from '@/components/AnalysisLoading';
import { analyzeFace } from '@/lib/gemini';
import { cn } from '@/lib/utils';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaid, setShowPaid] = useState(false);

  const handleImageSelect = useCallback((file, url) => {
    setImageFile(file);
    setImageUrl(url);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysisResult = await analyzeFace(imageFile);
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || '分析失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = useCallback(() => {
    setImageFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
    setShowPaid(false);
  }, []);

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 selection:bg-rose-200/50">
      <div className="container mx-auto px-4 py-10 max-w-md">
        <header className="text-center mb-10 space-y-2">
          <div className="inline-block p-2 bg-white rounded-2xl shadow-sm mb-2">
             <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 text-balance">
            SkinScan AI
          </h1>
          <p className="text-stone-500 text-sm tracking-wide">AI 颜值气质测评</p>
        </header>

        {!result ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading ? (
              <AnalysisLoading isLoading={isLoading} />
            ) : (
              <>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  isLoading={isLoading}
                />

                {error && (
                  <div className="text-center text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                {imageFile && !isLoading && (
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={handleAnalyze}
                      size="lg"
                      className="rounded-full bg-stone-900 text-white hover:bg-stone-800 px-10 shadow-lg shadow-stone-900/10 transition-transform active:scale-95"
                    >
                      开始测评
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ShareCard result={result} imageUrl={imageUrl} />

            {!showPaid ? (
              <div className="text-center space-y-4 pt-4">
                <Button
                  onClick={() => setShowPaid(true)}
                  variant="outline"
                  className="rounded-full border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 w-full max-w-xs h-12"
                >
                  解锁完整报告
                </Button>
                <p className="text-xs text-stone-400">查看详细分析 · 肤质诊断 · 护肤建议</p>
              </div>
            ) : (
              <DetailedReport result={result} />
            )}

            <div className="text-center pb-8">
              <Button 
                onClick={handleReset} 
                variant="ghost" 
                className="text-stone-400 hover:text-stone-600 hover:bg-transparent -tracking-tight"
              >
                重新测评
              </Button>
            </div>
          </div>
        )}

        <footer className="text-center mt-12 text-[10px] text-stone-300 uppercase tracking-widest">
          <p>仅供娱乐，结果不代表专业医学诊断</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
