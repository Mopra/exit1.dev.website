'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, ArrowRight, FolderTree, Globe, Radio, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureMedia =
  | { kind: 'video'; src: string; poster?: string }
  | { kind: 'image'; src: string; width: number; height: number };

type Feature = {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  media: FeatureMedia;
  href?: string;
  cta?: string;
};

const FEATURES: Feature[] = [
  {
    id: 'live-checks',
    label: 'Live checks',
    icon: Radio,
    title: 'Watch every probe land in real time.',
    description:
      'A streaming view of checks firing across regions — see status, latency, and failures the instant they happen.',
    media: {
      kind: 'video',
      src: '/exit1-live-page-mockup-1.web.mp4',
    },
    href: '/live-checks',
    cta: 'Explore live checks',
  },
  {
    id: 'folders',
    label: 'Folders',
    icon: FolderTree,
    title: 'Group checks the way your team thinks.',
    description:
      'Drag and drop checks into folders to organize by service, environment, or customer — no rigid tag schema required.',
    media: {
      kind: 'video',
      src: '/exit1-folder-view-mockup-1.web.mp4',
    },
  },
  {
    id: 'add-check',
    label: 'Adding checks',
    icon: Zap,
    title: 'Spin up a monitor in seconds.',
    description:
      'Paste a URL or host, pick an interval, and you are live. No agents, no tags, no YAML — just monitoring.',
    media: {
      kind: 'video',
      src: '/exit1-add-check-mockup-1.web.mp4',
    },
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: Activity,
    title: 'Replay every probe.',
    description:
      'Full request history with status codes, response bodies, and timing — so postmortems take minutes, not afternoons.',
    media: {
      kind: 'video',
      src: '/exit1-logs-mockup-1.web.mp4',
    },
  },
  {
    id: 'domain-intelligence',
    label: 'Domain intelligence',
    icon: ShieldCheck,
    title: 'SSL, WHOIS, and DNS in one place.',
    description:
      'Track certificate expiry, registrar info, and domain health alongside your uptime checks — so renewals never surprise you.',
    media: {
      kind: 'video',
      src: '/exit1-domain-intelligence-mockup-1.web.mp4',
    },
    href: '/domain-intelligence',
    cta: 'Explore domain intelligence',
  },
  {
    id: 'status-pages',
    label: 'Custom status pages',
    icon: Globe,
    title: 'Show customers you are up — without the design ticket.',
    description:
      'Drag-and-drop builder, real-time updates, 30-day history, and your domain. Ship a polished status page in minutes.',
    media: {
      kind: 'video',
      src: '/exit1-custom-status-page-setup-1.web.mp4',
    },
    href: '/status-pages',
    cta: 'Explore custom status pages',
  },
];

export function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, inView]);

  const current = FEATURES[active];

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Tab row — scrollable pill bar on mobile, wraps on larger screens */}
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="Feature highlights"
            className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-[#0F0F15]/85 p-1 backdrop-blur-md [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:max-w-none lg:flex-wrap lg:justify-center lg:overflow-visible lg:bg-white/[0.03] lg:backdrop-blur-sm"
          >
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === active;
              return (
                <button
                  key={feature.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`feature-panel-${feature.id}`}
                  id={`feature-tab-${feature.id}`}
                  onClick={() => setActive(index)}
                  className={cn(
                    'relative inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:px-4',
                    isActive
                      ? 'bg-white/10 text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{feature.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage */}
        <div className="mt-6 lg:mt-10">
          <div className="relative overflow-hidden rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-video w-full bg-black/40">
              {FEATURES.map((feature, index) => {
                const isActive = index === active;
                return (
                  <div
                    key={feature.id}
                    role="tabpanel"
                    id={`feature-panel-${feature.id}`}
                    aria-labelledby={`feature-tab-${feature.id}`}
                    aria-hidden={!isActive}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-500 ease-out',
                      isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                    )}
                  >
                    {feature.media.kind === 'video' ? (
                      <VideoSlide
                        src={feature.media.src}
                        videoRef={(el) => {
                          videoRefs.current[index] = el;
                        }}
                      />
                    ) : (
                      <Image
                        src={feature.media.src}
                        alt={feature.title}
                        fill
                        sizes="(min-width: 1024px) 1024px, 100vw"
                        priority={index === 0}
                        className="object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caption */}
          <div className="mt-8 lg:mt-20 text-center">
            <h2
              key={`title-${current.id}`}
              className="text-xl lg:text-3xl font-semibold tracking-tight animate-[feature-fade_400ms_ease-out]"
            >
              {current.title}
            </h2>
            <p
              key={`desc-${current.id}`}
              className="mt-3 max-w-2xl mx-auto text-sm lg:text-lg text-muted-foreground animate-[feature-fade_400ms_ease-out]"
            >
              {current.description}
            </p>
            {current.href && (
              <Link
                key={`cta-${current.id}`}
                href={current.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors animate-[feature-fade_400ms_ease-out]"
              >
                {current.cta ?? 'Learn more'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes feature-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

type VideoSlideProps = {
  src: string;
  videoRef: (el: HTMLVideoElement | null) => void;
};

function VideoSlide({ src, videoRef }: VideoSlideProps) {
  const localRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showScrubber, setShowScrubber] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  const setRefs = (el: HTMLVideoElement | null) => {
    localRef.current = el;
    videoRef(el);
  };

  const onTimeUpdate = () => {
    const v = localRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
  };

  const onLoadedMetadata = () => {
    const v = localRef.current;
    if (!v) return;
    setDuration(v.duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    // Show when in the bottom 30% of the stage
    setShowScrubber(y > rect.height * 0.7);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = localRef.current;
    if (!v || !v.duration) return;
    const pct = Number(e.target.value) / 1000;
    v.currentTime = pct * v.duration;
    setProgress(pct);
  };

  const fillPct = Math.round(progress * 100);
  const visible = showScrubber || scrubbing;

  return (
    <div
      className="relative h-full w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowScrubber(false)}
    >
      <video
        ref={setRefs}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        aria-hidden={!visible}
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0'
        )}
      />

      <div
        className={cn(
          'absolute inset-x-4 bottom-4 transition-opacity duration-200 sm:inset-x-6 sm:bottom-5',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={Math.round(progress * 1000)}
          aria-label="Video timeline"
          onChange={handleSeek}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={() => setScrubbing(false)}
          onPointerCancel={() => setScrubbing(false)}
          className="feature-scrubber w-full cursor-pointer"
          style={
            {
              '--fill': `${fillPct}%`,
            } as React.CSSProperties
          }
          disabled={!duration}
        />
      </div>

      <style jsx global>{`
        .feature-scrubber {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            #fff var(--fill, 0%),
            rgba(255, 255, 255, 0.25) var(--fill, 0%)
          );
          outline: none;
          transition: height 150ms ease;
        }
        .feature-scrubber:hover,
        .feature-scrubber:active {
          height: 6px;
        }
        .feature-scrubber::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #fff;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
          cursor: pointer;
        }
        .feature-scrubber::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #fff;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
          cursor: pointer;
        }
        .feature-scrubber:disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
