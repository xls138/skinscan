import { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ImageUpload({ onImageSelect, isLoading }) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageSelect?.(file, url);
  }, [onImageSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  return (
    <Card 
      className={cn(
        "w-full mx-auto transition-all duration-300 border-dashed border-2 bg-stone-50/50 shadow-none",
        dragOver ? 'border-stone-400 bg-stone-100' : 'border-stone-200',
        preview ? 'border-none p-0 bg-transparent' : 'max-w-sm'
      )}
    >
      <CardContent className={cn("p-0", !preview && "p-6")}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative group"
        >
          {preview ? (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {!isLoading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="bg-white/90 text-stone-900 px-6 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors">
                      重新选择
                    </span>
                  </label>
                </div>
              )}
            </div>
          ) : (
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <div className="aspect-square rounded-xl flex flex-col items-center justify-center gap-4 transition-colors">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-3xl shadow-inner">
                  📷
                </div>
                <div className="text-center space-y-1">
                  <p className="font-medium text-stone-700">上传照片</p>
                  <p className="text-xs text-stone-400">支持 JPG、PNG 格式</p>
                </div>
              </div>
            </label>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-stone-800">AI 分析中...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ImageUpload;
