"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text?: string;
  className?: string;
  speed?: number;
}

export function TypingAnimation({
  text = "Generating question...",
  className,
  speed = 50,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      // Reset animation after completion
      const resetTimer = setTimeout(() => {
        setDisplayedText("");
        setCurrentIndex(0);
      }, 1000);

      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="text-muted-foreground">{displayedText}</span>
      <span className="animate-pulse text-muted-foreground">|</span>
    </div>
  );
}
