"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Extract numeric value and suffix from the input
  const getNumericValue = (
    str: string
  ): { number: number; suffix: string; prefix: string } => {
    const match = str.match(/^(\$?)(\d*\.?\d+)([a-zA-Z%+]*?)$/);
    if (match) {
      return {
        prefix: match[1] || "",
        number: parseFloat(match[2]),
        suffix: match[3] || "",
      };
    }
    return { prefix: "", number: 0, suffix: str };
  };

  const { prefix, number: targetNumber, suffix } = getNumericValue(value);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // If it's not a number, just show the original value
            if (targetNumber === 0 && suffix === value) {
              setDisplayValue(value);
              return;
            }

            const startTime = Date.now();
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Use easing function for smoother animation
              const easeOutCubic = 1 - Math.pow(1 - progress, 3);
              const currentNumber = targetNumber * easeOutCubic;

              // Format the number based on the original format
              let formattedNumber: string;
              if (targetNumber % 1 === 0) {
                formattedNumber = Math.round(currentNumber).toString();
              } else {
                formattedNumber = currentNumber.toFixed(1);
              }

              setDisplayValue(prefix + formattedNumber + suffix);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplayValue(value); // Ensure we end with the exact target value
              }
            };

            requestAnimationFrame(animate);
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
  }, [targetNumber, suffix, prefix, value, duration, hasAnimated]);

  return (
    <div ref={elementRef} className={className}>
      {displayValue}
    </div>
  );
}
