import React, { useEffect, useRef, useState, useId, useCallback } from "react";

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: "R" | "G" | "B";
  yChannel?: "R" | "G" | "B";
  mixBlendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity"
    | "plus-darker"
    | "plus-lighter";
  className?: string;
  style?: React.CSSProperties;
  allowOverflow?: boolean;
  surfaceTint?: string;
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return { isDark, isClient };
};

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
  allowOverflow = false,
  surfaceTint,
}) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const { isDark, isClient } = useDarkMode();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const generateDisplacementMap = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    // NOTE: The 'red' / 'blue' / 'black' / '#0000' literals below are SVG filter
    // primitives that encode channel data for chromatic aberration — NOT theme
    // colors. They drive the displacement map and must remain as raw channel
    // values for the glass distortion effect to work.
    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }, [borderWidth, borderRadius, brightness, opacity, blur, mixBlendMode, redGradId, blueGradId]);

  const updateDisplacementMap = useCallback(() => {
    if (!isHydrated) return;
    feImageRef.current?.setAttribute("href", generateDisplacementMap());
  }, [isHydrated, generateDisplacementMap]);

  useEffect(() => {
    if (!isHydrated) return;
    
    updateDisplacementMap();
    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute(
          "scale",
          (distortionScale + offset).toString()
        );
        ref.current.setAttribute("xChannelSelector", xChannel);
        ref.current.setAttribute("yChannelSelector", yChannel);
      }
    });

    gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
  }, [
    isHydrated,
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode,
    updateDisplacementMap,
  ]);

  useEffect(() => {
    if (!containerRef.current || !isHydrated) return;

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isHydrated, updateDisplacementMap]);

  useEffect(() => {
    if (!isHydrated) return;
    setTimeout(updateDisplacementMap, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, width, height]);

  const supportsSVGFilters = () => {
    if (!isClient) return false;
    
    const isWebkit =
      /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {
      return false;
    }

    const div = document.createElement("div");
    div.style.backdropFilter = `url(#${filterId})`;
    return div.style.backdropFilter !== "";
  };

  const supportsBackdropFilter = () => {
    if (!isClient) return false;
    return CSS.supports("backdrop-filter", "blur(10px)");
  };

  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      ...style,
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      borderRadius: `${borderRadius}px`,
    } as React.CSSProperties;

    // Helpers — all surface tints derive from theme tokens via color-mix.
    const fg = "var(--foreground)";
    const bg = "var(--background)";
    const primary = "var(--primary)";
    const tint = (token: string, percent: number) =>
      `color-mix(in oklch, ${token} ${percent}%, transparent)`;

    // For SSR and initial render, use consistent fallback styles
    if (!isHydrated) {
      const fallbackSurface = surfaceTint ?? fg;
      return {
        ...baseStyles,
        background: tint(fallbackSurface, Math.max(backgroundOpacity * 100, 10)),
        border: `1px solid ${tint(fg, 20)}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      };
    }

    const svgSupported = supportsSVGFilters();
    const backdropFilterSupported = supportsBackdropFilter();

    if (svgSupported) {
      // Surface tint = contrast color (foreground in light, background in dark)
      // Inner highlight = always foreground; in dark theme that produces a
      // light specular, in light theme a subtle dark vignette.
      const surface = surfaceTint ?? (isDark ? bg : fg);
      const surfaceBg = `color-mix(in oklch, ${surface} ${backgroundOpacity * 100}%, transparent)`;
      const innerHi = tint(fg, isDark ? 15 : 5);
      const innerHiSoft = tint(fg, isDark ? 5 : 2);
      // Drop shadow is always dark relative to its surroundings.
      const dropShadow = tint(isDark ? bg : fg, 5);
      return {
        ...baseStyles,
        "--glass-frost": backgroundOpacity,
        "--glass-saturation": saturation,
        background: surfaceBg,
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        boxShadow: `0 0 1px 0px ${innerHi} inset,
             0 0 4px 2px ${innerHiSoft} inset,
             0px 4px 16px ${dropShadow},
             0px 8px 24px ${dropShadow},
             0px 16px 56px ${dropShadow}`,
      } as React.CSSProperties & { [key: string]: string | number | undefined };
    } else {
      if (isDark) {
        if (!backdropFilterSupported) {
          const fallbackSurface = surfaceTint ?? bg;
          return {
            ...baseStyles,
            background: tint(fallbackSurface, Math.max(backgroundOpacity * 100, 40)),
            border: `1px solid ${tint(fg, 20)}`,
            boxShadow: `inset 0 1px 0 0 ${tint(fg, 10)},
                        inset 0 -1px 0 0 ${tint(fg, 5)}`,
          };
        } else {
          const fallbackSurface = surfaceTint ?? fg;
          return {
            ...baseStyles,
            background: tint(fallbackSurface, Math.max(backgroundOpacity * 100, 10)),
            backdropFilter: "blur(12px) saturate(1.8) brightness(1.2)",
            WebkitBackdropFilter: "blur(12px) saturate(1.8) brightness(1.2)",
            border: `1px solid ${tint(fg, 20)}`,
            boxShadow: `inset 0 1px 0 0 ${tint(fg, 10)},
                        inset 0 -1px 0 0 ${tint(fg, 5)}`,
          };
        }
      } else {
        if (!backdropFilterSupported) {
          const fallbackSurface = surfaceTint ?? fg;
          return {
            ...baseStyles,
            background: tint(fallbackSurface, Math.max(backgroundOpacity * 100, 40)),
            border: `1px solid ${tint(fg, 30)}`,
            boxShadow: `inset 0 1px 0 0 ${tint(fg, 20)},
                        inset 0 -1px 0 0 ${tint(fg, 10)}`,
          };
        } else {
          const fallbackSurface = surfaceTint ?? fg;
          return {
            ...baseStyles,
            background: tint(fallbackSurface, Math.max(backgroundOpacity * 100, 25)),
            backdropFilter: "blur(12px) saturate(1.8) brightness(1.1)",
            WebkitBackdropFilter: "blur(12px) saturate(1.8) brightness(1.1)",
            border: `1px solid ${tint(fg, 30)}`,
            boxShadow: `0 8px 32px 0 ${tint(primary, 20)},
                        0 2px 16px 0 ${tint(primary, 10)},
                        inset 0 1px 0 0 ${tint(fg, 20)},
                        inset 0 -1px 0 0 ${tint(fg, 10)}`,
          };
        }
      }
    }
  };

  const glassSurfaceClasses =
    `relative flex items-center justify-center ${allowOverflow ? '' : 'overflow-hidden'} transition-opacity duration-[260ms] ease-out`;

  const focusVisibleClasses =
    "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";

  return (
    <div
      ref={containerRef}
      className={`${glassSurfaceClasses} ${focusVisibleClasses} ${className}`}
      style={getContainerStyles()}
    >
      {isHydrated && (
        <svg
          className="w-full h-full pointer-events-none absolute inset-0 -z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id={filterId}
              colorInterpolationFilters="sRGB"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              <feImage
                ref={feImageRef}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="map"
              />

              <feDisplacementMap
                ref={redChannelRef}
                in="SourceGraphic"
                in2="map"
                id="redchannel"
                result="dispRed"
              />
              <feColorMatrix
                in="dispRed"
                type="matrix"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="red"
              />

              <feDisplacementMap
                ref={greenChannelRef}
                in="SourceGraphic"
                in2="map"
                id="greenchannel"
                result="dispGreen"
              />
              <feColorMatrix
                in="dispGreen"
                type="matrix"
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="green"
              />

              <feDisplacementMap
                ref={blueChannelRef}
                in="SourceGraphic"
                in2="map"
                id="bluechannel"
                result="dispBlue"
              />
              <feColorMatrix
                in="dispBlue"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="blue"
              />

              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="output" />
              <feGaussianBlur
                ref={gaussianBlurRef}
                in="output"
                stdDeviation="0.7"
              />
            </filter>
          </defs>
        </svg>
      )}

      <div className="w-full h-full flex items-center justify-center rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;
