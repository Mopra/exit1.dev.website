---
title: "Engineering Internals: A 20-Line Semaphore and a Scheduler That Barely Touches the Database"
author: "Morten Pradsgaard"
category: "infrastructure-monitoring"
excerpt: "Two small but load-bearing pieces of code from our check runner: a lock-free semaphore that fits on a napkin, and an in-memory schedule that cut our database reads by over 99%."
date: "2026-04-12"
metaDescription: "How we run 200 concurrent network checks on a single Node.js box without race conditions or database bills. A permit-transfer semaphore and a decoupled in-memory scheduler."
---

# Engineering Internals: A 20-Line Semaphore and a Scheduler That Barely Touches the Database

Most of the uptime-monitoring product is unglamorous plumbing: HTTP requests, DNS lookups, certificate parsing, state machines. But two small pieces of code on the execution hot path do a disproportionate amount of work, and they're both small enough to walk through end to end. This post is about those two pieces.

## Part 1: A 20-line lock-free semaphore

Our VPS runner dispatches up to 200 concurrent checks per tick. Every check is a network call — could be a 50ms HTTP HEAD, could be a 30-second WebSocket handshake with a broken server. We need to cap concurrency, recover instantly when a check finishes, and never leak a permit.

The textbook solution is a semaphore: counter goes down on acquire, up on release. In a single-threaded language like JavaScript that's usually fine — but there's a subtlety that bit us.

Between "release increments counter" and "next waiter notices and acquires" there's a microtask gap. Under high contention that gap matters. Waiters pile up. Priorities invert. You end up debugging why check #847 took twelve seconds to start after check #646 finished.

So we wrote this:

```ts
class Semaphore {
  private permits: number;
  private waiting: (() => void)[] = [];

  constructor(max: number) { this.permits = max; }

  acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }
    return new Promise(resolve => this.waiting.push(resolve));
  }

  release(): void {
    const next = this.waiting.shift();
    if (next) {
      next(); // transfer permit directly — no increment
    } else {
      this.permits++;
    }
  }
}
```

Look at `release()`. If someone is waiting, we don't increment the counter. We call their resolver directly. The permit is never "free" — it's **transferred atomically** from the releasing task to the waiting task. The counter only changes when no one is waiting.

That tiny change means three things:

**Zero race windows.** In a naive implementation, you can briefly report `available = 1` while no one has actually acquired it yet. With direct transfer, the `available` count is always the true number of unheld permits.

**Strict FIFO.** Whoever called `acquire()` first gets the next permit. No priority inversion. No unlucky task starving because other tasks keep slipping in ahead of it.

**No microtask lag.** The resolver fires immediately from `release()`. The next acquirer's continuation is queued as a microtask and runs before any I/O callback can interleave.

It's not novel computer science. It's just the thing nobody bothers to write because the textbook version is close enough — until you're running 200 concurrent network checks on a box and you want every microsecond accounted for.

Twenty lines. No dependencies. Powers the whole runner.

## Part 2: A scheduler that barely touches the database

The naive way to run a check scheduler on top of a document database looks like this:

```
every tick:
  query: checks where nextCheckAt <= now
  run them
  write new nextCheckAt back
```

That works for a while. Then you have a few thousand checks at 2-minute intervals and you're doing hundreds of queries a minute, each one pulling documents over the wire, each one billed. At our scale, that path would have bankrupted us before it broke technically.

So we don't do it. The runner keeps the entire schedule in memory, sorted, and uses the database only for the two things a database is actually good at: durability and notifying us when a human changes something.

### The core data structure

A sorted array of `{id, nextCheckAt}`, ascending. On dispatch, we peel due entries off the front. Insertion uses binary search:

```ts
function binarySearchInsertIndex(schedule, nextCheckAt) {
  let lo = 0, hi = schedule.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (schedule[mid].nextCheckAt <= nextCheckAt) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

O(log n) lookup, O(n) insert due to array shifting. We measured, and at our sizes the shift is still a rounding error compared to the network call the check itself is about to make. When it stops being a rounding error, we'll switch to a heap. For now, array + binary search is the right trade.

### Three sync paths, each at a different frequency

1. **Every check run** updates its own `nextCheckAt` in the in-memory schedule synchronously, right after dispatching. No await. No database round-trip. The schedule is always correct for its own activity.

2. **User edits** (add, disable, change interval) flow through a lightweight `check_edits` collection watched by a real-time listener. We originally listened to the main `checks` collection directly, but that caused a **feedback loop** — the runner's own status writes triggered reads back to itself, hundreds of thousands of times a day. Splitting edits into their own collection dropped the listener traffic by ~99%.

3. **A 12-hour full resync** as a safety net. If an event was ever missed — network blip, deploy, cosmic ray — the periodic full reload guarantees we can't drift forever.

### The architectural decision underneath

This is the interesting part: **we decoupled the hot path from the sync path completely.**

- Hot path (check execution) touches in-memory state only.
- Sync path (persistence) is buffered, batched, and flushed asynchronously.
- The only place they meet is the post-check hook that updates the in-memory `nextCheckAt` — and that hook is a single map lookup plus a binary-search reinsert.

The result: one machine, 128 libuv threads, ~200 concurrent checks, 2-minute minimum interval, thousands of monitored endpoints, and database reads that look like a rounding error on the bill.

The lesson isn't "don't use a managed database for scheduling." It's "don't use your database of record as your hot-path data structure." Databases are great at being the source of truth. They're terrible at being the source of *every* truth, on every tick, forever.

## Both pieces together

Neither the semaphore nor the scheduler is clever on its own. The semaphore is a twenty-line JavaScript class. The scheduler is a sorted array and a listener. Either would fit in a screenshot.

What makes them worth writing about is how much weight they carry relative to their size. Everything else in the runner — the check executors, the status buffer, the retry logic, the alert pipeline — sits on top of these two primitives. When they're wrong, the whole system flails. When they're right, the whole system is almost boring.

That's usually the mark of load-bearing code. It doesn't look impressive. It just stops being a problem.
