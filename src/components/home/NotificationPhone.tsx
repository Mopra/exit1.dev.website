'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'down' | 'up' | 'warn';

type Notif = {
  app: string;
  sender: string;
  body: string;
  time: string;
  tileColor: string;
  status: Status;
  /** Brand glyph masked to white; omit for the SMS/Messages tile (Lucide icon). */
  logo?: string;
};

// Newest alert is appended last; the driver shows them top-first as they land.
const FEED: Notif[] = [
  {
    app: 'Messages',
    sender: 'exit1.dev',
    body: 'api.acme.com is DOWN — HTTP 500',
    time: 'now',
    tileColor: '#34C759',
    status: 'down',
  },
  {
    app: 'Slack',
    sender: '#alerts',
    body: 'cdn.acme.com slow — 1,240ms response',
    time: 'now',
    tileColor: '#4A154B',
    status: 'warn',
    logo: '/slack.svg',
  },
  {
    app: 'Discord',
    sender: 'exit1 · #monitoring',
    body: 'api.acme.com recovered — down 3m 12s',
    time: 'now',
    tileColor: '#5865F2',
    status: 'up',
    logo: '/discord.svg',
  },
];

const STATUS_DOT: Record<Status, string> = {
  down: 'bg-destructive',
  up: 'bg-success',
  warn: 'bg-warning',
};

const maskStyle = (src: string): CSSProperties => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function NotificationPhone() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<{ id: string; notif: Notif }[]>([]);

  // Static fallback: all alerts already landed (newest on top).
  useEffect(() => {
    if (!reduce) return;
    setShown(FEED.map((notif, i) => ({ id: `s-${i}`, notif })).reverse());
  }, [reduce]);

  useEffect(() => {
    if (reduce || !inView) return;
    let cancelled = false;
    let cycle = 0;

    async function run() {
      while (!cancelled) {
        cycle++;
        setShown([]);
        await sleep(700);
        for (let i = 0; i < FEED.length; i++) {
          if (cancelled) return;
          const entry = { id: `${cycle}-${i}`, notif: FEED[i] };
          setShown((s) => [entry, ...s]); // newest lands on top, pushes others down
          await sleep(i === FEED.length - 1 ? 4200 : 1700);
        }
        await sleep(1600);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex justify-center">
      <div className="relative h-[520px] w-[260px] rounded-[2.6rem] border border-white/[0.12] bg-white/[0.02] p-3 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] sm:h-[560px] sm:w-[280px]">
        {/* soft screen glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-12 h-40 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem]">
          {/* lock screen clock */}
          <div className="px-5 pt-14 text-center">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Monday · June
            </div>
            <div className="mt-1 text-6xl font-light tracking-tight text-white">9:41</div>
          </div>

          {/* notifications */}
          <div className="mt-8 flex flex-col gap-2.5 px-3">
            <AnimatePresence mode="popLayout">
              {shown.map(({ id, notif }) => (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, y: -14, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-white/[0.08] px-3 py-2.5 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                      style={{ background: notif.tileColor }}
                    >
                      {notif.logo ? (
                        <span
                          aria-hidden="true"
                          className="h-[18px] w-[18px] bg-white"
                          style={maskStyle(notif.logo)}
                        />
                      ) : (
                        <MessageSquare className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                          {notif.app}
                        </span>
                        <span className="text-[10px] text-white/40">{notif.time}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', STATUS_DOT[notif.status])} />
                        <span className="truncate text-[13px] font-medium text-white">
                          {notif.sender}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs leading-snug text-white/65">{notif.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* home indicator */}
          <div className="absolute bottom-3 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
