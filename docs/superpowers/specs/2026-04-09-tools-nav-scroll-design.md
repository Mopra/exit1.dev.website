# Tools Nav — Horizontal Scroll Design

**Date:** 2026-04-09  
**Status:** Approved

## Problem

`ToolsNav` uses `flex-wrap`, causing pills to break into multiple rows as the tool count grows. The number of tools is expected to increase indefinitely.

## Solution

Convert the nav to a single-row horizontally scrollable strip with CSS-only fade gradients as scroll hints.

## Changes

### `src/components/ToolsNav.tsx`

- Remove `flex-wrap` from the pill container
- Add `overflow-x-auto` and `scrollbar-hide` to enable horizontal scroll without a visible scrollbar
- Wrap the scroll container in a relative `<div>` that holds two absolutely-positioned fade overlay `<div>`s:
  - **Left fade:** `absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none`
  - **Right fade:** `absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none`
- Both fades are always visible (CSS-only, no JS scroll tracking)
- Remove `max-w-4xl` from the nav or widen to `max-w-full` so the strip fills available width before scrolling

### No changes to:
- Pill styles, active state, icons, or link behaviour
- The `tools` array or data shape
- Any page that renders `<ToolsNav />`

## Trade-offs Accepted

- Left fade is visible at rest (scroll position 0). This is a common pattern and acceptable given the simplicity benefit of zero JS.
- If tool count exceeds ~15, revisit with an overflow "More" dropdown.
