# Website Design Principles Implementation Inventory

## Overview

This document lists all pages, posts, and components that need to be updated to match the design principles. The homepage (`src/app/page.tsx`) serves as the reference implementation.

## Implementation Guidelines

### Component Reusability (DRY Principle)

**Always create reusable components when patterns repeat:**
- Extract common patterns into reusable components
- If the same pattern appears in 2+ places, create a component
- This includes the homepage - refactor it to use reusable components where possible
- Think DRY: Don't Repeat Yourself

**Examples of reusable patterns to extract:**
- Background layers (grid + gradients) - used on all pages
- Page container with borders (`max-w-6xl` with vertical borders)
- Section wrapper with top border
- Grid item with proper borders and padding
- Hero section structure

### Component Priority

**Always use shadcn components first:**
1. Check if shadcn has a component that fits the need
2. Use shadcn component and extend with custom styling if needed
3. Only create custom components if shadcn doesn't have it

**This applies to:**
- All pages, including the homepage
- All new components
- All refactoring efforts

**shadcn components available:**
- `Button`, `Card`, `Input`, `Badge`, `Dialog`, `Sheet`, `Accordion`, `Table`, `Checkbox`, `NavigationMenu`, `Separator`

**If creating a custom component:**
- Place it in `src/components/` (not `src/components/ui/`)
- Follow shadcn component patterns for consistency
- Document when and why a custom component was created

### Content Preservation (SEO Critical)

**Content must not be changed unless absolutely necessary:**
- **Do not modify text content** - headings, paragraphs, descriptions, or any copy
- **Do not change HTML structure** - semantic HTML should remain unchanged
- **Do not remove or alter metadata** - titles, descriptions, structured data must stay the same
- Only change content if it's absolutely necessary for the design to work
- If content changes are required, document why and what changed

**This is essential for SEO:**
- Preserves Google search rankings
- Maintains keyword positioning
- Keeps structured data intact
- Prevents index disruption

**What can change:**
- CSS classes and styling
- Layout structure (if it doesn't affect content hierarchy)
- Component structure (if content remains the same)

**What must not change:**
- Text content (headings, paragraphs, descriptions)
- HTML structure (H1, H2, H3 hierarchy)
- Meta tags and structured data
- URLs and routing

### Blog Posts - Special Requirements

**Blog posts must be extremely dynamic using only reusable components:**
- **No custom code in blog post templates** - all styling must come from reusable components
- Blog posts are rendered via `src/app/blog/[slug]/page.tsx` and `src/app/blog/page.tsx`
- All blog post pages must use the same reusable components
- The blog listing (`BlogClient` component) must use reusable components only
- Content is markdown - styling should come from reusable layout components, not inline styles
- Any custom styling needed should be extracted into a reusable component first

**This ensures:**
- Consistency across all 81 blog posts
- Easy maintenance - changes to one component affect all posts
- No page-specific custom code to maintain
- Dynamic rendering works seamlessly

### Mobile Design Guidelines

**Mobile-first approach is essential:**
- **Single column by default** - grids activate at `md` breakpoint (768px)
- **Touch-friendly targets** - interactive elements should be at least 44px (minimum touch target)
- **Padding scaling** - Use `px-6 lg:px-8` for responsive padding
- **Typography scaling** - Fluid text sizes with breakpoint adjustments (`text-5xl sm:text-6xl lg:text-7xl`)

**Mobile-specific considerations:**
- **Vertical borders** - Main container borders should still be visible on mobile
- **Section borders** - Top borders on sections remain visible
- **Grid items** - Stack vertically on mobile, activate grid at `md:grid` breakpoint
- **Spacing** - Generous padding (`px-20 py-20`) may need adjustment for mobile screens
- **Button sizing** - Ensure buttons are comfortably tappable on mobile
- **Text readability** - Maintain proper contrast and line height for mobile reading

**Breakpoints:**
- `sm`: 640px (Small tablets)
- `md`: 768px (Tablets) - Grid activation point
- `lg`: 1024px (Laptops)
- `xl`: 1280px (Desktops)

**Testing on mobile:**
- Test on actual mobile devices when possible
- Use browser dev tools mobile emulation
- Verify touch targets are easily tappable
- Check text remains readable without zooming
- Ensure borders and gradients render correctly

## Pages

### Main Pages
- `src/app/page.tsx` ✅ (Reference implementation)

### Feature Pages
- `src/app/about/page.tsx`
- `src/app/getting-started/page.tsx`
- `src/app/free-uptime-monitor/page.tsx`
- `src/app/free-website-monitor/page.tsx`
- `src/app/real-time-monitoring/page.tsx`
- `src/app/ssl-monitoring/page.tsx`
- `src/app/alerting/page.tsx`
- `src/app/analytics/page.tsx`
- `src/app/global-monitoring/page.tsx`
- `src/app/api-webhooks/page.tsx`
- `src/app/logs/page.tsx`

### Product Pages
- `src/app/product/monitoring/page.tsx`
- `src/app/product/alerting/page.tsx`
- `src/app/product/analytics/page.tsx`
- `src/app/product/global/page.tsx`
- `src/app/product/ssl-monitoring/page.tsx`

### Supporting Pages
- `src/app/data-privacy/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/roadmap/page.tsx`
- `src/app/site-map/page.tsx`

### Blog Pages
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`

### Auth Pages
- `src/app/signin/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/install/page.tsx`

## Blog Posts

Blog posts are rendered dynamically via `src/app/blog/[slug]/page.tsx`. The following categories and posts exist:

### Category: monitoring (19 posts)
- `src/content/posts/monitoring/agency-msp-free-uptime-monitor-playbook.md`
- `src/content/posts/monitoring/best-free-uptime-monitoring-tools.md`
- `src/content/posts/monitoring/building-exit1-dev-how-i-made-premium-monitoring-free.md`
- `src/content/posts/monitoring/exit1-vs-uptimerobot-migration-checklist.md`
- `src/content/posts/monitoring/free-freshping-alternative.md`
- `src/content/posts/monitoring/free-freshping-alternative-for-teams.md`
- `src/content/posts/monitoring/free-freshping-replacement-uptime-monitoring.md`
- `src/content/posts/monitoring/free-freshping-shutdown-migration-checklist.md`
- `src/content/posts/monitoring/free-sla-monitoring-tools.md`
- `src/content/posts/monitoring/free-ssl-monitoring-email-alerts.md`
- `src/content/posts/monitoring/free-uptime-monitor-ecommerce-guide.md`
- `src/content/posts/monitoring/free-uptime-monitor-serverless-edge-functions.md`
- `src/content/posts/monitoring/free-uptime-monitor-static-sites-jamstack.md`
- `src/content/posts/monitoring/free-website-monitor-discord-integration.md`
- `src/content/posts/monitoring/free-website-monitoring-audit-sla-evidence.md`
- `src/content/posts/monitoring/free-website-monitoring-beyond-uptime-checklist.md`
- `src/content/posts/monitoring/free-website-monitoring-shopify-woocommerce.md`
- `src/content/posts/monitoring/free-website-monitoring-tools-2025.md`
- `src/content/posts/monitoring/importance-of-real-time-alerts.md`
- `src/content/posts/monitoring/incident-postmortem-templates-with-exit1.md`
- `src/content/posts/monitoring/intro-to-website-monitoring.md`
- `src/content/posts/monitoring/jamstack-github-pages-uptime-monitoring.md`
- `src/content/posts/monitoring/multi-region-performance-tuning-global-probes.md`
- `src/content/posts/monitoring/pagerduty-opsgenie-webhook-automation-exit1.md`
- `src/content/posts/monitoring/pingdom-alternative-free-unlimited-monitoring.md`
- `src/content/posts/monitoring/pingdom-free-alternative.md`
- `src/content/posts/monitoring/real-time-vs-5-minute-monitoring.md`
- `src/content/posts/monitoring/setup-free-uptime-monitor-wordpress.md`
- `src/content/posts/monitoring/sla-reporting-free-uptime-stack.md`
- `src/content/posts/monitoring/soc2-iso-website-monitoring-prep-guide.md`
- `src/content/posts/monitoring/ssl-certificate-monitoring-alerts-made-easy-and-why-it-matters.md`
- `src/content/posts/monitoring/statuscake-vs-free-monitoring.md`
- `src/content/posts/monitoring/troubleshooting-false-positives-free-uptime-monitor.md`
- `src/content/posts/monitoring/understanding-website-downtime.md`
- `src/content/posts/monitoring/uptimerobot-alternative-free-unlimited.md`
- `src/content/posts/monitoring/uptimerobot-alternatives.md`
- `src/content/posts/monitoring/uptrends-free-alternative.md`
- `src/content/posts/monitoring/website-monitoring-101.md`
- `src/content/posts/monitoring/website-monitoring-best-practices-2025.md`

### Category: ai (2 posts)
- `src/content/posts/ai/ai-anomaly-detection-monitoring.md`
- `src/content/posts/ai/ai-integration-for-website-monitoring.md`

### Category: api-monitoring (4 posts)
- `src/content/posts/api-monitoring/api-endpoint-monitoring-playbook-2025.md`
- `src/content/posts/api-monitoring/api-error-budgets-sla.md`
- `src/content/posts/api-monitoring/api-observability-automation-toolkit.md`
- `src/content/posts/api-monitoring/platform-api-monitoring-operations-guide.md`

### Category: cronjob-monitoring (4 posts)
- `src/content/posts/cronjob-monitoring/cronjob-monitoring-metrics-that-matter.md`
- `src/content/posts/cronjob-monitoring/cronjob-monitoring-playbook-free-scheduled-task-observability.md`
- `src/content/posts/cronjob-monitoring/free-cronjob-monitor-setup-serverless-schedules.md`
- `src/content/posts/cronjob-monitoring/scheduled-task-monitoring-checklist-heartbeats-retries-alerts.md`

### Category: incident-management (4 posts)
- `src/content/posts/incident-management/free-incident-management-runbook.md`
- `src/content/posts/incident-management/free-incident-management-toolkit.md`
- `src/content/posts/incident-management/free-incident-management-war-room.md`
- `src/content/posts/incident-management/free-incident-management-with-exit1.md`

### Category: infrastructure-monitoring (4 posts)
- `src/content/posts/infrastructure-monitoring/free-infrastructure-monitoring-stack.md`
- `src/content/posts/infrastructure-monitoring/free-infrastructure-monitoring-tools-comparison-2025.md`
- `src/content/posts/infrastructure-monitoring/free-server-monitoring-checklist-2025.md`
- `src/content/posts/infrastructure-monitoring/sre-playbook-free-infrastructure-monitoring.md`

### Category: sla (4 posts)
- `src/content/posts/sla/free-sla-monitoring-checklist.md`
- `src/content/posts/sla/free-sla-monitoring-for-msps.md`
- `src/content/posts/sla/free-sla-monitoring-reporting-playbook.md`
- `src/content/posts/sla/free-sla-monitoring-strategy.md`

**Total Blog Posts**: 81 posts across 7 categories

## Components

### Main Components
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/Hero.tsx`
- `src/components/BlogClient.tsx`
- `src/components/ProductPage.tsx`

### Utility Components
- `src/components/AccuracySection.tsx`
- `src/components/CookieSettings.tsx`
- `src/components/GlassNavigation.tsx`
- `src/components/GlassSurface.tsx`
- `src/components/GlassTest.tsx`
- `src/components/MagicBento.tsx`
- `src/components/Prism.tsx`
- `src/components/SearchInput.tsx`
- `src/components/StructuredData.tsx`
- `src/components/TableOfContents.tsx`
- `src/components/WhyFree.tsx`

### UI Components (shadcn)
These are shadcn components and should generally not need updates, but may need styling adjustments:
- `src/components/ui/accordion.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/table.tsx`

### Special Components
- `src/components/magicui/globe.tsx`

## Reference Documentation

- **Design Principles**: See `docs/website-design-principles.md` for detailed design specifications
- **Reference Implementation**: `src/app/page.tsx` (homepage) - use as inspiration for all pages

## Testing & Verification

Before considering a page complete, verify:

### Visual Verification
- [ ] Page matches homepage design style (black background, gradients, borders)
- [ ] `max-w-6xl` container is used with vertical borders
- [ ] Sections have top borders (`inset 0 0.1px 0 0 white`)
- [ ] Grid items have full borders if in a grid layout
- [ ] Background layers (grid pattern + gradients) are visible
- [ ] Typography hierarchy matches design principles

### Responsive Testing
- [ ] Mobile (< 640px) - layout adapts correctly
- [ ] Tablet (768px) - grid activates where needed
- [ ] Desktop (> 1024px) - full layout renders properly
- [ ] Borders visible at all breakpoints
- [ ] Text readable at all sizes

### Functional Testing
- [ ] All links work correctly
- [ ] All buttons have `cursor-pointer` class
- [ ] Interactive elements respond to hover/focus
- [ ] Forms work correctly (if applicable)
- [ ] No console errors

### Content Verification (SEO)
- [ ] No text content was changed
- [ ] HTML heading hierarchy preserved (H1, H2, H3)
- [ ] Meta tags unchanged
- [ ] Structured data intact (check page source)

### Performance
- [ ] Page loads without layout shift
- [ ] Gradients don't cause performance issues
- [ ] Animations are smooth (if any)
- [ ] No unnecessary re-renders

## Notes

- Blog posts are rendered through `src/app/blog/[slug]/page.tsx` - update that page template to apply design principles
- Blog listing is rendered through `src/app/blog/page.tsx` and `src/components/BlogClient.tsx`
- Components used across multiple pages should be updated to maintain consistency
- UI components (shadcn) may need theme/styling adjustments rather than structural changes
