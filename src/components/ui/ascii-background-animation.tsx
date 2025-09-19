"use client";

import { useEffect, useRef } from "react";

interface ASCIIAnimationProps {
  className?: string;
  density?: number; // Controls density of symbols (1-10)
  animationSpeed?: number; // Controls speed of animation (1-10)
  symbols?: string[]; // Array of symbols to use
  fadeEdges?: boolean; // Whether to fade edges
}

export function ASCIIBackgroundAnimation({
  className = "",
  density = 5,
  animationSpeed = 3,
  symbols = ["#"],
  fadeEdges = true,
}: ASCIIAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to fill container
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation state
    const chars: Array<{
      x: number;
      y: number;
      opacity: number;
      symbol: string;
      speed: number;
      delay: number;
      phase: number;
      colorPhase: number; // For color animation
      colorIndex: number; // Starting color index
    }> = [];

    // Initialize characters based on density
    const initializeChars = () => {
      chars.length = 0;
      const rect = canvas.getBoundingClientRect();
      const cols = Math.floor(rect.width / 12); // Approximate character width
      const rows = Math.floor(rect.height / 16); // Approximate character height
      const totalChars = Math.floor((cols * rows * density) / 10);

      for (let i = 0; i < totalChars; i++) {
        chars.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          opacity: Math.random() * 0.6 + 0.3, // Higher base opacity (0.3-0.9)
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          speed: (Math.random() * 0.5 + 0.1) * (animationSpeed / 5),
          delay: Math.random() * 2000, // Random delay before animation starts
          phase: Math.random() * Math.PI * 2,
          colorPhase: Math.random() * Math.PI * 2, // For color animation
          colorIndex: Math.floor(Math.random() * 4), // Starting color index (0-3)
        });
      }
    };

    initializeChars();

    // Define blue and cyan color palette for seamless mesh effect
    const colorPalette = [
      [59, 130, 246], // Primary blue (blue-500)
      [34, 197, 94], // Blue-cyan mix
      [6, 182, 212], // Cyan-500
      [14, 165, 233], // Sky blue (sky-500)
    ];

    // Function to interpolate between two colors
    const interpolateColor = (
      color1: number[],
      color2: number[],
      factor: number
    ): number[] => {
      return [
        color1[0] + (color2[0] - color1[0]) * factor,
        color1[1] + (color2[1] - color1[1]) * factor,
        color1[2] + (color2[2] - color1[2]) * factor,
      ];
    };

    // Animation loop
    const startTime = Date.now();
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      chars.forEach((char) => {
        // Skip if in delay phase
        if (elapsed < char.delay) return;

        // Update phase for wave-like animation
        char.phase += char.speed;
        char.colorPhase += char.speed * 0.5; // Color changes slower than opacity

        // Calculate opacity with sine wave for pulsing effect
        const baseOpacity = char.opacity;
        const pulseOpacity = Math.sin(char.phase) * 0.3 + baseOpacity; // Increased pulse effect

        // Apply fade to edges if enabled
        let edgeFade = 1;
        if (fadeEdges) {
          const edgeDistance = Math.min(
            char.x,
            rect.width - char.x,
            char.y,
            rect.height - char.y
          );
          const fadeDistance = Math.min(rect.width, rect.height) * 0.15; // Reduced fade distance
          edgeFade = Math.min(1, edgeDistance / fadeDistance);
        }

        const finalOpacity = Math.max(
          0.1, // Minimum opacity
          Math.min(1.0, pulseOpacity * edgeFade) // Allow full opacity
        );

        // Calculate gradient color
        const colorFactor = (Math.sin(char.colorPhase) + 1) / 2; // Normalize to 0-1
        const currentColorIndex = char.colorIndex % colorPalette.length;
        const nextColorIndex = (char.colorIndex + 1) % colorPalette.length;

        const currentColor = colorPalette[currentColorIndex];
        const nextColor = colorPalette[nextColorIndex];
        const interpolatedColor = interpolateColor(
          currentColor,
          nextColor,
          colorFactor
        );

        // Set character style with gradient color
        ctx.font =
          "14px ui-monospace, SFMono-Regular, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', monospace";

        // Apply the gradient color with opacity
        const [r, g, b] = interpolatedColor;
        ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(
          b
        )}, ${finalOpacity})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw character
        ctx.fillText(char.symbol, char.x, char.y);

        // Occasionally change position and color slightly for dynamic movement
        if (Math.random() < 0.001) {
          char.x += (Math.random() - 0.5) * 2;
          char.y += (Math.random() - 0.5) * 2;

          // Keep within bounds
          char.x = Math.max(10, Math.min(rect.width - 10, char.x));
          char.y = Math.max(10, Math.min(rect.height - 10, char.y));
        }

        // Occasionally shift color index for more variety
        if (Math.random() < 0.0005) {
          char.colorIndex = (char.colorIndex + 1) % colorPalette.length;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [density, animationSpeed, symbols, fadeEdges]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
    />
  );
}
