"use client";

import { useState, useRef, useTransition, useCallback, useEffect } from "react";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";

interface SlideToButtonProps {
  onConfirm: () => Promise<void> | void;
  text?: string;
  price?: string;
  disabled?: boolean;
}

export function SlideToBuyButton({
  onConfirm,
  text = "Slide to Place Order!",
  disabled = false,
}: SlideToButtonProps) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const completionThreshold = useRef(0.80); // 95% required to complete

  const handleComplete = useCallback(() => {
    setIsComplete(true);
    startTransition(async () => {
      try {
        setError(null);
        await onConfirm();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Purchase failed. Please try again."
        );
        setIsComplete(false);
        setSliderPosition(0);
      }
      handleReset();
    });
  }, [onConfirm]);

  const updateSliderPosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current || !sliderRef.current) return;
      if (isComplete || disabled || !isDragging) return;

      const container = containerRef.current.getBoundingClientRect();
      const currentX = clientX - container.left;
      const maxX = container.width - sliderRef.current.offsetWidth;
      const progress = Math.max(0, Math.min(currentX, maxX));
      const progressPercent = progress / maxX;

      setSliderPosition(progress);

      if (progressPercent >= completionThreshold.current) {
        setIsDragging(false);
        handleComplete();
      }
    },
    [isComplete, disabled, isDragging, handleComplete]
  );

  const handleMouseDown = () => {
    if (disabled || isComplete || isPending) return;
    setIsDragging(true);
    setError(null);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (!isComplete) {
      setSliderPosition(0);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const handleReset = () => {
    setIsComplete(false);
    setSliderPosition(0);
    setError(null);
  };

  const progressPercent = containerRef.current
    ? (sliderPosition /
        (containerRef.current.offsetWidth -
          (sliderRef.current?.offsetWidth || 56))) *
      100
    : 0;

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {error && (
        <div className="w-full max-w-md flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div
        ref={containerRef}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        className="relative w-full max-w-md h-14 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-md overflow-hidden cursor-grab active:cursor-grabbing transition-shadow duration-200"
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Slide to complete purchase"
      >
        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
          <span className="text-slate-600 dark:text-slate-400 font-medium text-sm tracking-wide">
            {isComplete ? "Order Placed!" : text}
          </span>
        </div>

        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{ transform: `translateX(${sliderPosition}px)` }}
          className={`absolute top-0 left-0 h-full w-14 rounded-lg shadow-md flex items-center justify-center font-semibold transition-all duration-75 ${
            isComplete
              ? "bg-emerald-500 dark:bg-emerald-600 shadow-lg cursor-default"
              : isDragging
                ? "bg-primary  shadow-lg cursor-grabbing"
                : "bg-primary cursor-grab hover:bg-primary/90"
          } ${isPending ? "opacity-75" : ""}`}
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          ) : isComplete ? (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          ) : (
            <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          )}
        </div>
      </div>

      {/* Price display */}

      
    </div>
  );
}
