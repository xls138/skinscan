/**
 * [INPUT]: react hooks, @/components/ui/button
 * [OUTPUT]: CameraCapture component
 * [POS]: components/CameraCapture - Camera selfie capture replacing image upload
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CameraCapture({ onCapture, isLoading }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // ============================================================================
  // CAMERA LIFECYCLE
  // ============================================================================

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsReady(true);
        };
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      if (err.name === "NotAllowedError") {
        setError("请允许访问摄像头权限");
      } else if (err.name === "NotFoundError") {
        setError("未检测到摄像头设备");
      } else {
        setError("摄像头启动失败");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => startCamera(), 0);
    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // ============================================================================
  // CAPTURE LOGIC
  // ============================================================================

  const doCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror the image (since front camera is mirrored)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    // Get image data
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCapturedImage({ blob, url });
          stopCamera();
        }
      },
      "image/jpeg",
      0.9,
    );
  }, [stopCamera]);

  const handleCapture = useCallback(() => {
    // Start 3-second countdown
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Actually capture the image
          doCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [doCapture]);

  const handleRetake = useCallback(() => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    setCapturedImage(null);
    startCamera();
  }, [capturedImage, startCamera]);

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      // Convert blob to File object
      const file = new File([capturedImage.blob], "selfie.jpg", {
        type: "image/jpeg",
      });
      onCapture?.(file, capturedImage.url);
    }
  }, [capturedImage, onCapture]);

  // ============================================================================
  // RENDER
  // ============================================================================

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="aspect-3/4 rounded-2xl bg-stone-100 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-3xl">
            📷
          </div>
          <p className="text-stone-600 text-sm">{error}</p>
          <Button
            onClick={startCamera}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  // Captured image preview
  if (capturedImage) {
    return (
      <div className="w-full max-w-sm mx-auto space-y-4">
        <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
          <img
            src={capturedImage.url}
            alt="Captured"
            className="w-full h-full object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-stone-800">
                  AI 分析中...
                </span>
              </div>
            </div>
          )}
        </div>

        {!isLoading && (
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRetake}
              variant="outline"
              className="rounded-full px-6 border-stone-200"
            >
              重拍
            </Button>
            <Button
              onClick={handleConfirm}
              className="rounded-full px-8 bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/10"
            >
              开始测评
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Camera preview
  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-stone-900 shadow-xl ring-1 ring-black/10">
        {/* Video element - mirrored for natural selfie view */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Face guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Darkened corners */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 300 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="face-mask">
                <rect width="100%" height="100%" fill="white" />
                <ellipse cx="150" cy="180" rx="95" ry="120" fill="black" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.4)"
              mask="url(#face-mask)"
            />
          </svg>

          {/* Face outline */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[63%] aspect-[0.79] border-2 border-white/60 rounded-[50%] border-dashed" />

          {/* Guide text */}
          <div className="absolute bottom-20 left-0 right-0 text-center">
            <p className="text-white/90 text-sm font-medium drop-shadow-lg">
              将脸部对准框内
            </p>
          </div>
        </div>

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-8xl font-bold text-white drop-shadow-lg animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Loading overlay before camera ready */}
        {!isReady && (
          <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white/80 text-sm">正在启动摄像头...</span>
            </div>
          </div>
        )}
      </div>

      {/* Capture button */}
      <div className="flex justify-center">
        <button
          onClick={handleCapture}
          disabled={!isReady || countdown !== null}
          className={cn(
            "w-16 h-16 rounded-full bg-white border-4 border-stone-300 shadow-lg",
            "flex items-center justify-center",
            "transition-all duration-200",
            "hover:scale-105 hover:border-stone-400",
            "active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          )}
        >
          <div className="w-12 h-12 rounded-full bg-stone-900" />
        </button>
      </div>

      <p className="text-center text-xs text-stone-400">
        点击拍照按钮开始倒计时
      </p>
    </div>
  );
}

export default CameraCapture;
