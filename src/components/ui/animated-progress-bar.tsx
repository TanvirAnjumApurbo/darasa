"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedProgressBarProps {
  percentage: number;
  className?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedProgressBar({
  percentage,
  className = "",
  duration = 1500,
  delay = 0,
}: AnimatedProgressBarProps) {
  const [currentWidth, setCurrentWidth] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const animateProgress = useCallback(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smoother animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentPercentage = percentage * easeOutCubic;

      setCurrentWidth(currentPercentage);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [duration, percentage]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => {
              setHasAnimated(true);
              animateProgress();
            }, delay);
          } else if (!entry.isIntersecting) {
            // Reset animation when element goes out of view
            setHasAnimated(false);
            setCurrentWidth(0);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, hasAnimated, duration, percentage, animateProgress]);

  return (
    <div
      ref={elementRef}
      className={`w-full bg-muted rounded-full h-2 ${className}`}
    >
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${currentWidth}%` }}
      />
    </div>
  );
}
