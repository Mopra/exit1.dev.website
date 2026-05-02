# Design System — exit1.dev (marketing site)

Single source of truth for tokens lives in [`src/app/globals.css`](../src/app/globals.css). Don't hardcode colors, fonts, or radii anywhere else — re-theme by editing the `:root` block.

---

## Aesthetic in one line

Warm cream paper background, deep evergreen primary, generous whitespace, type-first hero, light glassmorphism on chips/CTAs, aurora blobs and specular sweeps for ambient depth. Light theme only — no dark mode toggle.

---

## Color tokens

All colors are exposed as CSS custom properties on `:root` and consumed via Tailwind utilities (`bg-primary`, `text-foreground`, `border-success/20`, etc.). Most values are in oklch; brand anchors stay in hex.

### Surfaces & text
| Token | Value | Notes |
|---|---|---|
| `--background` | `#FFFCF0` | Warm cream paper. The page canvas. |
| `--foreground` | `oklch(0.2138 0.0019 286.2347)` | Near-black, slight cool cast. |
| `--card` / `--popover` | `oklch(0.9901 0.0161 95.2193)` | Slightly warmer than background. |
| `--muted` | `oklch(0.9665 0.0149 94.1982)` | Subtle fill (table headers, code inline). |
| `--muted-foreground` | `oklch(0.5555 0 0)` | Body copy in `.prose`, secondary text. |
| `--accent` | `oklch(0.9702 0 0)` | Hover surfaces, soft chips. |
| `--secondary` | `oklch(0.9565 0.0204 74.6609)` | Warm off-white. |
| `--border` / `--input` | `oklch(0.9219 0 0)` | Hairline neutrals. |
| `--ring` | `var(--primary)` | Focus ring is always primary. |

### Brand
| Token | Value | Notes |
|---|---|---|
| `--primary` | `#2F8F6F` | Evergreen. The single brand color. |
| `--primary-foreground` | `#FFFCF0` | Cream-on-green for solid CTAs. |

### Status palette
| Token | Value | Use |
|---|---|---|
| `--success` | `oklch(0.62 0.13 167)` | Check marks, "operational". |
| `--warning` | `oklch(0.78 0.16 78)` | Cautions, soft amber. |
| `--info` | `oklch(0.62 0.13 230)` | Neutral informational. |
| `--destructive` | `oklch(0.5379 0.2186 25.9751)` | Errors, "down". |

Each has a paired `*-foreground` token for text on solid fills.

### Pricing tiers
| Token | Value | Use |
|---|---|---|
| `--tier-free` | `oklch(0.55 0 0)` | Mid-grey. |
| `--tier-nano` | `var(--primary)` | Featured tier — uses brand. |
| `--tier-pro` | `oklch(0.62 0.16 50)` | Warm copper. |
| `--tier-agency` | `oklch(0.45 0.18 265)` | Deep indigo. |

### Decorative — gradients, aurora, glow
| Token | Value |
|---|---|
| `--decorative-from` | `var(--primary)` |
| `--decorative-via` | `oklch(0.7 0.09 167)` |
| `--decorative-to` | `oklch(0.65 0.10 145)` |
| `--aurora-1` | `oklch(0.7 0.10 167)` (greens) |
| `--aurora-2` | `oklch(0.75 0.07 95)` (warm) |
| `--aurora-3` | `oklch(0.65 0.09 145)` (forest) |

### Third-party brand
| Token | Value |
|---|---|
| `--brand-discord` | `oklch(0.6 0.20 275)` |
| `--brand-eu` | `oklch(0.36 0.18 265)` |

### Code blocks
IDE-style dark surface inside an otherwise light page.
| Token | Value |
|---|---|
| `--code-background` | `oklch(0.20 0.012 264)` |
| `--code-foreground` | `oklch(0.92 0.008 95)` |
| `--code-border` | `oklch(0.30 0.012 264)` |
| `--code-muted` | `oklch(0.65 0.015 95)` |

Per-token syntax colors come from Shiki (VS Code Dark+) via `rehype-pretty-code` — we only own structural styling in `.prose pre`.

### Charts
`--chart-1` → `--chart-5`, a blue ramp from `oklch(0.81 …)` down to `oklch(0.42 …)`.

---

## Typography

Loaded as Next.js fonts in [`src/app/layout.tsx`](../src/app/layout.tsx).

| Family | Variable | Use |
|---|---|---|
| **DM Sans** | `--font-dm-sans` → `--font-sans` | Everything UI. |
| **Space Mono** | `--font-space-mono` → `--font-mono` | Code labels, monospace UI. |
| Cascadia / Fira Code (system) | — | Inside `.prose pre` code blocks. |

### Scale (from `new_home` hero + `.prose`)
- **Display** — `text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight`
- **H1** — `text-2xl sm:text-3xl font-semibold tracking-tight`
- **H2** — `text-xl sm:text-2xl font-semibold tracking-tight`
- **H3** — `text-lg sm:text-xl font-medium`
- **Lead paragraph** — `text-xl sm:text-2xl text-foreground/70 leading-relaxed`
- **Body (prose)** — `text-sm sm:text-base text-muted-foreground leading-relaxed`

Defaults: `antialiased`, `font-feature-settings: "liga" 1` site-wide; ligatures explicitly disabled inside code blocks (`"liga" 0, "calt" 0`).

---

## Radius

Driven by a single `--radius: 0.5rem`.

| Token | Value |
|---|---|
| `--radius-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `var(--radius)` |
| `--radius-xl` | `calc(var(--radius) + 4px)` |

CTAs and pills use `rounded-full`. Cards/inputs use the radius scale.

---

## Layout primitives

Defined in [`src/components/PageLayout.tsx`](../src/components/PageLayout.tsx). Compose pages from these — don't reinvent containers.

```tsx
<PageShell>          {/* min-h-screen, page bg, mounts <FinalCta/> at bottom */}
  <PageContainer>    {/* max-w-6xl, mx-auto, hairline inset borders L/R */}
    <PageSection>    {/* hairline inset border on top, vertical rhythm */}
      <SectionContent size="sm|md|lg|xl">
        {/* sm=3xl  md=4xl (default)  lg=5xl  xl=6xl */}
      </SectionContent>
    </PageSection>
  </PageContainer>
</PageShell>
```

- **Outer width**: `max-w-6xl` (1152px).
- **Borders between sections**: hairline inset shadows via `.border-inset-*` utilities — never full `1px solid` borders.
- **Section padding**: `px-4 sm:px-0` on sections; padding lives on the inner content (`p-8 sm:p-12`), not the outer rail.
- **Final CTA**: `<FinalCta />` is auto-mounted by `PageShell`; don't add another at the bottom of the page.

---

## Components & patterns

### Buttons
shadcn `Button` from [`src/components/ui/button.tsx`](../src/components/ui/button.tsx). Variants: `default | destructive | outline | secondary | ghost | link`. Sizes: `sm | default | lg | icon`.

**Hero / final CTA** (overrides default radius and size for emphasis):
```tsx
<Button
  size="lg"
  className="rounded-full px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
>
```

**Secondary CTA** (glass on cream):
```tsx
<Button
  variant="outline"
  size="lg"
  className="rounded-full px-8 py-6 text-lg font-semibold text-primary border-primary/20 bg-primary/[0.04] shadow-sm backdrop-blur-md hover:bg-primary/[0.08] hover:border-primary/30"
>
```

### Glassmorphism utilities
Translucent tints sitting on the page background. Text uses `text-foreground` (not `*-foreground`) because the visible backdrop is the page, not a solid status color.

```
.glass-primary       bg-primary/15 + border-primary/20 + backdrop-blur-md
.glass-success       bg-success/15 + border-success/20 + backdrop-blur-md
.glass-warning       …
.glass-destructive   …
```

### Status indicators (same family, no blur)
```
.status-operational  bg-success/15 + border-success/20
.status-warning      bg-warning/15 + border-warning/20
.status-critical     bg-destructive/15 + border-destructive/20
.status-unknown      bg-muted-foreground/15 + border-muted-foreground/20
```

### Glow / depth
- `.glow-card` — soft brand-tinted gradient wash, `from-primary/[0.02]`.
- `.inner-glow` / `.inner-ring-glow` — primary-derived inset shadows for emphasis blocks.
- `.specular-sweep` / `.specular-diagonal` — foreground-tinted highlight bands.
- `.aurora-blob-1|2|3` — `bg-aurora-*/4x` + `blur-3xl` for ambient lighting.

### Inset borders
Use these instead of regular borders when a hairline is desired:
```
.border-inset-x   .border-inset-y
.border-inset-top .border-inset-bottom
.border-inset
```
All driven by `color-mix(in oklch, var(--foreground) 20%, transparent)`.

### Brand-mask logos
The integrations marquee on `/new_home` masks SVGs with `bg-foreground` so every logo renders as a single foreground silhouette at `opacity-70 → 100` on hover. Use this pattern when rendering third-party logos in horizontal scrollers — keep them monochrome, not full-color.

---

## Motion

Keyframes defined in `globals.css`, applied via utility classes.

| Class | Keyframes | Duration | Use |
|---|---|---|---|
| `.animate-aurora-1` | `aurora-1` | 6.5s ease-in-out infinite | Ambient blobs |
| `.animate-aurora-2` | `aurora-2` | 9s ease-in-out infinite | Ambient blobs |
| `.animate-aurora-3` | `aurora-3` | 7.8s ease-in-out infinite | Ambient blobs |
| `.animate-spec-sweep` | `specSweep` | 5.5s ease-in-out infinite | Highlight pass on cards |
| `.animate-spec-drift-y` | `specDriftY` | 7.5s ease-in-out infinite | Slow vertical drift |
| `.animate-marquee` | `marquee` | 60s linear infinite | Logo carousel; pair with `flex w-max` and a duplicated track |

GSAP and Framer Motion are available for richer interactions but ambient motion stays in CSS.

---

## Accessibility

- `*:focus-visible` → `outline-2 outline-offset-2 outline-ring` (ring = primary).
- Skip link mounted in [`src/app/layout.tsx`](../src/app/layout.tsx); styled via `.skip-link` in `globals.css`.
- All interactive elements should pair `cursor-pointer` with `transition-all duration-200` (`.interactive` utility available).
- Status colors must never carry meaning alone — pair with icons (Lucide) or text.

---

## Iconography

`lucide-react` only. Hero check rows use `<Check className="w-5 h-5 text-success shrink-0" />`. Don't mix icon libraries.

---

## What NOT to do

- No `bg-black`, no dark theme overrides — the site is single-theme light/cream.
- No raw hex/rgb in components. Use tokens.
- No solid `border` utilities for section dividers — use `.border-inset-*`.
- No nested `max-w-*` inside `SectionContent` — pick the right `size` prop instead.
- No `box-shadow` for glow/specular — use the named utilities so a re-theme propagates.
