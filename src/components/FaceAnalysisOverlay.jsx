/**
 * [INPUT]: imageUrl, compact prop, face-api.js models
 * [OUTPUT]: FaceAnalysisOverlay 组件 (面部区域检测可视化)
 * [POS]: components/FaceAnalysisOverlay, 用于 ShareCard 内嵌
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";

const ZONE_COLORS = {
  forehead: "#22c55e",
  nose: "#ef4444",
  leftCheek: "#22c55e",
  rightCheek: "#22c55e",
  chin: "#22c55e",
};

const ZONE_LABELS = {
  forehead: "F",
  nose: "E",
  leftCheek: "W1",
  rightCheek: "W2",
  chin: "C",
};

export function FaceAnalysisOverlay({ imageUrl, onComplete, compact = false }) {
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Failed to load face-api models:", err);
      }
    };
    loadModels();
  }, []);

  const drawFaceZones = useCallback((canvas, landmarks) => {
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 2;
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";

    const drawZone = (points, color, label) => {
      if (points.length < 3) return;

      ctx.strokeStyle = color;
      ctx.fillStyle = color + "20";

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

      ctx.fillStyle = color;
      ctx.fillText(label, centerX, centerY + 4);
    };

    const jawLine = landmarks.getJawOutline();
    const leftEyebrow = landmarks.getLeftEyeBrow();
    const rightEyebrow = landmarks.getRightEyeBrow();
    const nose = landmarks.getNose();

    const foreheadPoints = [
      { x: jawLine[0].x, y: leftEyebrow[0].y - 50 },
      { x: jawLine[16].x, y: rightEyebrow[4].y - 50 },
      { x: rightEyebrow[4].x, y: rightEyebrow[4].y - 8 },
      { x: rightEyebrow[0].x, y: rightEyebrow[0].y - 8 },
      { x: leftEyebrow[4].x, y: leftEyebrow[4].y - 8 },
      { x: leftEyebrow[0].x, y: leftEyebrow[0].y - 8 },
    ];
    drawZone(foreheadPoints, ZONE_COLORS.forehead, ZONE_LABELS.forehead);

    const noseTop = nose[0];
    const noseBottom = nose[6];
    const noseLeft = nose[4];
    const noseRight = nose[8];
    const nosePoints = [
      { x: noseTop.x - 12, y: noseTop.y },
      { x: noseTop.x + 12, y: noseTop.y },
      { x: noseRight.x, y: noseRight.y },
      { x: noseBottom.x, y: noseBottom.y + 4 },
      { x: noseLeft.x, y: noseLeft.y },
    ];
    drawZone(nosePoints, ZONE_COLORS.nose, ZONE_LABELS.nose);

    const leftCheekPoints = [
      { x: jawLine[0].x, y: jawLine[0].y },
      { x: jawLine[1].x, y: jawLine[1].y },
      { x: jawLine[2].x, y: jawLine[2].y },
      { x: jawLine[3].x, y: jawLine[3].y },
      { x: jawLine[4].x, y: jawLine[4].y },
      { x: noseLeft.x, y: noseLeft.y },
      { x: leftEyebrow[0].x, y: leftEyebrow[0].y + 16 },
    ];
    drawZone(leftCheekPoints, ZONE_COLORS.leftCheek, ZONE_LABELS.leftCheek);

    const rightCheekPoints = [
      { x: jawLine[16].x, y: jawLine[16].y },
      { x: jawLine[15].x, y: jawLine[15].y },
      { x: jawLine[14].x, y: jawLine[14].y },
      { x: jawLine[13].x, y: jawLine[13].y },
      { x: jawLine[12].x, y: jawLine[12].y },
      { x: noseRight.x, y: noseRight.y },
      { x: rightEyebrow[4].x, y: rightEyebrow[4].y + 16 },
    ];
    drawZone(rightCheekPoints, ZONE_COLORS.rightCheek, ZONE_LABELS.rightCheek);
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!imageUrl || !isModelLoaded || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const targetWidth = 400;
      const scale = targetWidth / img.width;
      canvas.width = targetWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray =
          data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);

      try {
        const detection = await faceapi
          .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detection) {
          drawFaceZones(canvas, detection.landmarks);
        }
      } catch (err) {
        console.error("Face detection failed:", err);
      }

      setAnalysisComplete(true);
      onComplete?.();
    };

    img.src = imageUrl;
  }, [imageUrl, isModelLoaded, drawFaceZones, onComplete]);

  useEffect(() => {
    if (isModelLoaded && imageUrl) {
      analyzeImage();
    }
  }, [isModelLoaded, imageUrl, analyzeImage]);

  if (compact) {
    return (
      <div className="w-full h-full">
        <div className="grid grid-cols-2 gap-1 h-full rounded-none overflow-hidden">
          <div className="relative bg-stone-900 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
            {!analysisComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/80">
                <div className="text-center">
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                  <p className="text-emerald-400 text-[10px] font-medium">
                    {!isModelLoaded ? "加载中..." : "识别中..."}
                  </p>
                </div>
              </div>
            )}
            <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-emerald-400 font-mono">
              AI SCAN
            </div>
          </div>

          <div className="relative">
            <img
              src={imageUrl}
              alt="Original"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-mono">
              ORIGINAL
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-85 mx-auto">
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-xl">
        <div className="relative bg-stone-900">
          <canvas ref={canvasRef} className="w-full h-auto block" />
          {!analysisComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900/80">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-emerald-400 text-xs font-medium">
                  {!isModelLoaded ? "加载模型..." : "识别面部..."}
                </p>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono">
            AI SCAN
          </div>
        </div>

        <div className="relative">
          <img
            src={imageUrl}
            alt="Original"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-mono">
            ORIGINAL
          </div>
        </div>
      </div>

      {analysisComplete && (
        <div className="mt-3 flex justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-stone-500">检测区域</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-stone-500">重点关注</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaceAnalysisOverlay;
