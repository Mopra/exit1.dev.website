"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
  href?: string;
  video?: {
    src: string;
    width?: number;
    height?: number;
  };
  image?: {
    src: string;
    alt?: string;
  };
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "oklch(0.86 0.06 231)";
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  {
    color: "oklch(0.05 0 0)",
    title: "Real-Time Monitoring",
    description: "Free uptime monitoring for unlimited websites and APIs",
    label: "Core",
    href: "/real-time-monitoring",
  },
  {
    color: "oklch(0.05 0 0)",
    title: "SSL Monitoring",
    description: "SSL certificate monitoring with expiration alerts",
    label: "Security",
    href: "/ssl-monitoring",
  },
  {
    color: "oklch(0.05 0 0)",
    title: "Analytics & Reports",
    description: "Comprehensive statistics and performance insights",
    label: "Reports and KPIs",
    href: "/analytics",
    video: {
      src: "https://i.gyazo.com/2c3ef8c205a6e7ea51d06bbae3e16ad1.mp4",
      width: 1330,
      height: 800,
    },
  },
  {
    color: "oklch(0.05 0 0)",
    title: "Smart Alerting",
    description: "Webhook integration and real-time notifications",
    label: "Alerts",
    href: "/alerting",
    image: {
      src: "/app.exit1.dev_logs.png",
      alt: "Exit1.dev logs interface",
    },
  },
  {
    color: "oklch(0.05 0 0)",
    title: "Website Monitoring",
    description: "Real-time monitoring with performance tracking and analytics",
    label: "Monitoring",
    href: "/global-monitoring",
  },
  {
    color: "oklch(0.05 0 0)",
    title: "Data Privacy",
    description: "GDPR compliant with transparent data handling",
    label: "Protection",
    href: "/data-privacy",
  },
];

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: oklch(0.86 0.06 231);
    box-shadow: 0 0 6px oklch(0.86 0.06 231 / 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, oklch(0.86 0.06 231 / 0.4) 0%, oklch(0.86 0.06 231 / 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        oklch(0.86 0.06 231 / 0.15) 0%,
        oklch(0.86 0.06 231 / 0.08) 15%,
        oklch(0.86 0.06 231 / 0.04) 25%,
        oklch(0.86 0.06 231 / 0.02) 40%,
        oklch(0.86 0.06 231 / 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

           const handleMouseMove = (e: MouseEvent) => {
         if (!spotlightRef.current || !gridRef.current) return;

         const section = gridRef.current.closest(".bento-section");
         const rect = section?.getBoundingClientRect();
         const mouseInside =
           rect &&
           e.clientX >= rect.left &&
           e.clientX <= rect.right &&
           e.clientY >= rect.top &&
           e.clientY <= rect.bottom;

         isInsideSection.current = mouseInside || false;
         const cards = gridRef.current.querySelectorAll(".card");

         if (!mouseInside) {
           gsap.to(spotlightRef.current, {
             opacity: 0,
             duration: 0.3,
             ease: "power2.out",
           });
           cards.forEach((card) => {
             (card as HTMLElement).style.setProperty("--glow-intensity", "0");
             (card as HTMLElement).style.setProperty("--glow-x", "50%");
             (card as HTMLElement).style.setProperty("--glow-y", "50%");
           });
           return;
         }

      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          cardElement,
          e.clientX,
          e.clientY,
          glowIntensity,
          spotlightRadius
        );
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };

         const handleMouseLeave = () => {
       isInsideSection.current = false;
       gridRef.current?.querySelectorAll(".card").forEach((card) => {
         (card as HTMLElement).style.setProperty("--glow-intensity", "0");
         (card as HTMLElement).style.setProperty("--glow-x", "50%");
         (card as HTMLElement).style.setProperty("--glow-y", "50%");
       });
       if (spotlightRef.current) {
         gsap.to(spotlightRef.current, {
           opacity: 0,
           duration: 0.3,
           ease: "power2.out",
         });
       }
     };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-2 p-3 select-none relative w-full"
    style={{ fontSize: "clamp(1.1rem, 1rem + 0.6vw, 1.6rem)" }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>
        {`
                     .bento-section {
             --glow-x: 50%;
             --glow-y: 50%;
             --glow-intensity: 0;
             --glow-radius: 200px;
             --glow-color: oklch(0.86 0.06 231);
             --border-color: oklch(1 0 0 / 10%);
             --background-dark: oklch(0.05 0 0);
             --white: oklch(0.985 0 0);
             --primary-color: oklch(0.86 0.06 231);
             --primary-glow: oklch(0.86 0.06 231 / 0.2);
             --primary-border: oklch(0.86 0.06 231 / 0.8);
           }
          
          .card-responsive {
            grid-template-columns: 1fr;
            width: 100%;
            padding: 0.5rem;
          }
          
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
            }
            
            .card-responsive .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            
            .card-responsive .card:nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          
                     .card--border-glow::after {
             content: '';
             position: absolute;
             inset: 0;
             padding: 6px;
             background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                 oklch(0.86 0.06 231 / calc(var(--glow-intensity) * 0.8)) 0%,
                 oklch(0.86 0.06 231 / calc(var(--glow-intensity) * 0.4)) 30%,
                 transparent 60%);
             border-radius: inherit;
             mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
             mask-composite: subtract;
             -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
             -webkit-mask-composite: xor;
             pointer-events: none;
             transition: opacity 0.3s ease;
             z-index: 1;
             opacity: 0;
           }
           
                      .card--border-glow:hover::after {
             opacity: 1;
           }
          
          .card--border-glow:hover {
            box-shadow: 0 4px 20px oklch(0.86 0.06 231 / 0.4), 0 0 30px oklch(0.86 0.06 231 / 0.2);
          }
          
                     .particle::before {
             content: '';
             position: absolute;
             top: -2px;
             left: -2px;
             right: -2px;
             bottom: -2px;
             background: oklch(0.86 0.06 231 / 0.2);
             border-radius: 50%;
             z-index: -1;
           }
          
          .particle-container:hover {
            box-shadow: 0 4px 20px oklch(0.86 0.06 231 / 0.2), 0 0 30px oklch(0.86 0.06 231 / 0.2);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .card__title {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }
          
          .card__description {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
          
          .card__label {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
          
          .card__video {
            border-radius: 20px;
            overflow: hidden;
          }
          
          .card__video video {
            border-radius: 20px;
          }
          
          .card__video-overlay {
            pointer-events: none;
          }
          
          .card:hover .card__video-overlay {
            opacity: 0;
          }
          
          .card__image-overlay {
            pointer-events: none;
          }
          
          .card:hover .card__image-overlay {
            opacity: 0;
          }
          
          .card__content {
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.7) 100%);
            padding: 1rem;
            border-radius: 12px;
            backdrop-filter: blur(4px);
          }
          
          .card__header {
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%);
            padding: 0.75rem;
            border-radius: 12px;
            backdrop-filter: blur(4px);
            margin: 0.5rem;
          }
          
          @media (max-width: 599px) {
            .card-responsive {
              grid-template-columns: 1fr;
              width: 100%;
              padding: 0.5rem;
            }
            
            .card-responsive .card {
              width: 100%;
              min-height: 180px;
            }
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? "card--border-glow" : ""
            }`;

            const cardStyle = {
              backgroundColor: card.color || "var(--background-dark)",
              borderColor: "var(--border-color)",
              color: "var(--white)",
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": "0",
              "--glow-radius": "200px",
            } as React.CSSProperties;

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={`${baseClassName} ${card.href ? 'cursor-pointer' : ''}`}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {card.href && (
                    <a href={card.href} className="absolute inset-0 z-20" aria-label={`Learn more about ${card.title}`} />
                  )}
                  <div className="card__header flex justify-between gap-3 relative text-white z-10">
                    <span className="card__label text-lg font-medium text-white/95">{card.label}</span>
                  </div>
                  {card.video && (
                    <div className="card__video absolute inset-0 z-0">
                      <video
                        src={card.video.src}
                        width={card.video.width}
                        height={card.video.height}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover rounded-[20px]"
                      />
                      <div className="card__video-overlay absolute inset-0 bg-black/50 rounded-[20px] transition-opacity duration-300 ease-in-out"></div>
                    </div>
                  )}
                  {card.image && (
                    <div className="card__image absolute inset-0 z-0">
                      <img
                        src={card.image.src}
                        alt={card.image.alt || ""}
                        className="w-full h-full object-cover rounded-[20px]"
                      />
                      <div className="card__image-overlay absolute inset-0 bg-black/50 rounded-[20px] transition-opacity duration-300 ease-in-out"></div>
                    </div>
                  )}
                  <div className="card__content flex flex-col relative text-white z-10">
                    <h3
                      className={`card__title font-semibold text-xl m-0 mb-2 text-white ${textAutoHide ? "text-clamp-1" : ""}`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`card__description text-sm leading-6 text-white/90 font-normal ${textAutoHide ? "text-clamp-2" : ""}`}
                    >
                      {card.description}
                    </p>
                  </div>
                </ParticleCard>
              );
            }

            return (
              <div
                key={index}
                className={`${baseClassName} ${card.href ? 'cursor-pointer' : ''}`}
                style={cardStyle}
                ref={(el) => {
                  if (!el) return;

                  const handleMouseMove = (e: MouseEvent) => {
                    if (shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    if (enableTilt) {
                      const rotateX = ((y - centerY) / centerY) * -10;
                      const rotateY = ((x - centerX) / centerX) * 10;

                      gsap.to(el, {
                        rotateX,
                        rotateY,
                        duration: 0.1,
                        ease: "power2.out",
                        transformPerspective: 1000,
                      });
                    }

                    if (enableMagnetism) {
                      const magnetX = (x - centerX) * 0.05;
                      const magnetY = (y - centerY) * 0.05;

                      gsap.to(el, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }
                  };

                  const handleMouseLeave = () => {
                    if (shouldDisableAnimations) return;

                    if (enableTilt) {
                      gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }

                    if (enableMagnetism) {
                      gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }
                  };

                  const handleClick = (e: MouseEvent) => {
                    if (!clickEffect || shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const maxDistance = Math.max(
                      Math.hypot(x, y),
                      Math.hypot(x - rect.width, y),
                      Math.hypot(x, y - rect.height),
                      Math.hypot(x - rect.width, y - rect.height)
                    );

                    const ripple = document.createElement("div");
                    ripple.style.cssText = `
                      position: absolute;
                      width: ${maxDistance * 2}px;
                      height: ${maxDistance * 2}px;
                      border-radius: 50%;
                      background: radial-gradient(circle, oklch(0.86 0.06 231 / 0.4) 0%, oklch(0.86 0.06 231 / 0.2) 30%, transparent 70%);
                      left: ${x - maxDistance}px;
                      top: ${y - maxDistance}px;
                      pointer-events: none;
                      z-index: 1000;
                    `;

                    el.appendChild(ripple);

                    gsap.fromTo(
                      ripple,
                      {
                        scale: 0,
                        opacity: 1,
                      },
                      {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => ripple.remove(),
                      }
                    );
                  };

                  el.addEventListener("mousemove", handleMouseMove);
                  el.addEventListener("mouseleave", handleMouseLeave);
                  el.addEventListener("click", handleClick);
                }}
              >
                {card.href && (
                  <a href={card.href} className="absolute inset-0 z-20" aria-label={`Learn more about ${card.title}`} />
                )}
                <div className="card__header flex justify-between gap-3 relative text-white z-10">
                  <span className="card__label text-lg font-medium text-white/95">{card.label}</span>
                </div>
                {card.video && (
                  <div className="card__video absolute inset-0 z-0">
                    <video
                      src={card.video.src}
                      width={card.video.width}
                      height={card.video.height}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-[20px]"
                    />
                    <div className="card__video-overlay absolute inset-0 bg-black/50 rounded-[20px] transition-opacity duration-300 ease-in-out"></div>
                  </div>
                )}
                {card.image && (
                  <div className="card__image absolute inset-0 z-0">
                    <img
                      src={card.image.src}
                      alt={card.image.alt || ""}
                      className="w-full h-full object-cover rounded-[20px]"
                    />
                    <div className="card__image-overlay absolute inset-0 bg-black/50 rounded-[20px] transition-opacity duration-300 ease-in-out"></div>
                  </div>
                )}
                <div className="card__content flex flex-col relative text-white z-10">
                  <h3
                    className={`card__title font-semibold text-xl m-0 mb-2 text-white ${textAutoHide ? "text-clamp-1" : ""}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`card__description text-sm leading-6 text-white/90 font-normal ${textAutoHide ? "text-clamp-2" : ""}`}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
