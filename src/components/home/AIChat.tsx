'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'down' | 'up' | 'warn' | 'muted';

type Line = { status: Status; text: string; detail?: string };

type Exchange = {
  q: string;
  intro: string;
  lines: Line[];
  outro?: string;
};

const EXCHANGES: Exchange[] = [
  {
    q: 'Did anything go down this week?',
    intro: 'Two checks failed this week:',
    lines: [
      { status: 'down', text: 'api.acme.com', detail: 'down 3m · Tue' },
      { status: 'down', text: 'cdn.acme.com', detail: 'down 40s · Thu' },
    ],
    outro: 'Both recovered automatically.',
  },
  {
    q: "What's my API uptime this month?",
    intro: 'api.acme.com over the last 30 days:',
    lines: [
      { status: 'up', text: '99.97% uptime', detail: '' },
      { status: 'muted', text: '13m downtime', detail: '2 incidents' },
    ],
  },
  {
    q: 'Any SSL certs expiring soon?',
    intro: 'One certificate needs attention:',
    lines: [{ status: 'warn', text: 'shop.acme.com', detail: 'expires in 8 days' }],
    outro: 'The rest are valid for 60+ days.',
  },
];

const STATUS_DOT: Record<Status, string> = {
  down: 'bg-destructive',
  up: 'bg-success',
  warn: 'bg-warning',
  muted: 'bg-muted-foreground/50',
};

type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; phase: 'thinking' }
  | ({ id: string; role: 'assistant'; phase: 'answer' } & Exchange);

const TYPE_SPEED = 38;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AIChat() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [caret, setCaret] = useState(false);

  // Static fallback for reduced motion: show a couple of completed exchanges.
  useEffect(() => {
    if (!reduce) return;
    setMessages(
      EXCHANGES.slice(0, 2).flatMap((ex, i) => [
        { id: `s-${i}-user`, role: 'user', text: ex.q } as ChatMessage,
        { id: `s-${i}-assistant`, role: 'assistant', phase: 'answer', ...ex } as ChatMessage,
      ])
    );
  }, [reduce]);

  useEffect(() => {
    if (reduce || !inView) return;
    let cancelled = false;
    let cycle = 0;

    async function run() {
      while (!cancelled) {
        // Start a fresh conversation thread
        cycle++;
        setMessages([]);
        setInput('');
        await sleep(500);

        for (let exIndex = 0; exIndex < EXCHANGES.length; exIndex++) {
          if (cancelled) return;
          const ex = EXCHANGES[exIndex];
          const assistantId = `${cycle}-${exIndex}-assistant`;

          // Type the question into the input
          setCaret(true);
          await sleep(exIndex === 0 ? 200 : 700);
          for (let i = 1; i <= ex.q.length; i++) {
            if (cancelled) return;
            setInput(ex.q.slice(0, i));
            await sleep(TYPE_SPEED);
          }
          await sleep(360);
          if (cancelled) return;

          // Send it — append to the running thread
          setCaret(false);
          setInput('');
          setMessages((m) => [...m, { id: `${cycle}-${exIndex}-user`, role: 'user', text: ex.q }]);
          await sleep(680);
          if (cancelled) return;

          // AI is typing
          setMessages((m) => [...m, { id: assistantId, role: 'assistant', phase: 'thinking' }]);
          await sleep(1400);
          if (cancelled) return;

          // AI answers — replace only this exchange's pending bubble
          setMessages((m) =>
            m.map((msg) =>
              msg.id === assistantId
                ? { id: assistantId, role: 'assistant', phase: 'answer', ...ex }
                : msg
            )
          );
          await sleep(exIndex === EXCHANGES.length - 1 ? 5600 : 1700);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduce]);

  return (
    <div
      ref={ref}
      className="flex h-[400px] flex-col rounded-2xl bg-white/[0.03] p-4 sm:h-[440px] sm:p-5"
    >
      {/* Window header */}
      <div className="flex items-center gap-2 pb-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-xs text-muted-foreground">exit1 · MCP</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
          connected
        </span>
      </div>

      {/* Messages — anchored to the bottom so they grow upward like a real chat.
          Older turns scroll up past the top and fade out via the mask. */}
      <div className="flex flex-1 flex-col justify-end gap-3 overflow-hidden pt-4 [mask-image:linear-gradient(to_bottom,transparent,#000_14%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_14%)]">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) =>
            msg.role === 'user' ? (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-white/[0.07] px-3.5 py-2 text-sm text-foreground"
              >
                {msg.text}
              </motion.div>
            ) : (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[90%] self-start rounded-2xl rounded-bl-sm bg-white/[0.05] px-3.5 py-3"
              >
                <AnimatePresence mode="wait">
                  {msg.phase === 'thinking' ? (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1 py-1"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="answer"
                      initial="hidden"
                      animate="show"
                      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                      className="space-y-2.5"
                    >
                      <AnswerLine>
                        <p className="text-sm text-muted-foreground">{msg.intro}</p>
                      </AnswerLine>
                      <div className="space-y-1.5">
                        {msg.lines.map((line, i) => (
                          <AnswerLine key={i}>
                            <div className="flex items-center gap-2.5">
                              <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', STATUS_DOT[line.status])} />
                              <span className="text-sm text-foreground">{line.text}</span>
                              {line.detail && (
                                <span className="font-mono text-xs text-muted-foreground">{line.detail}</span>
                              )}
                            </div>
                          </AnswerLine>
                        ))}
                      </div>
                      {msg.outro && (
                        <AnswerLine>
                          <p className="text-sm text-muted-foreground">{msg.outro}</p>
                        </AnswerLine>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Input row — non-interactive, shows the question being typed */}
      <div className="mt-4 flex items-center gap-2 rounded-full bg-white/[0.05] py-2 pl-4 pr-2">
        <div className="flex flex-1 items-center text-sm">
          {input ? (
            <span className="text-foreground">{input}</span>
          ) : (
            !caret && <span className="text-muted-foreground/50">Ask about your monitors…</span>
          )}
          {caret && (
            <motion.span
              aria-hidden="true"
              className="ml-0.5 inline-block h-4 w-px bg-foreground/70"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            />
          )}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
            input ? 'bg-primary text-primary-foreground' : 'bg-white/[0.06] text-muted-foreground'
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function AnswerLine({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
