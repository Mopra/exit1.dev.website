# Website Design Principles

## Overview

The Exit1.dev website follows a clean, structured design philosophy inspired by Vercel's approach - minimal, grid-based layouts with clear boundaries and premium visual treatment.

## Core Design Principles

### 1. Clear Grid System

- **Container width**: `max-w-6xl` (1152px width) for main content wrapper
- **Grid layouts**: Use CSS Grid for feature sections (`md:grid md:grid-cols-3`)
- **Consistent structure**: Sections follow predictable grid patterns
- **Responsive breakpoints**: Single column on mobile, multi-column on larger screens

### 2. Borders on Grid Edges

Borders are applied strategically using inset box-shadows for a clean, refined look:

- **Main container**: Vertical borders on left and right edges
  ```css
  box-shadow: inset 0.1px 0 0 0 white, inset -0.1px 0 0 0 white
  ```

- **Section dividers**: Horizontal border on top edge of each section
  ```css
  box-shadow: inset 0 0.1px 0 0 white
  ```

- **Grid item borders**: Full border around each grid cell
  ```css
  box-shadow: inset 0 0 0 0.1px white
  ```

This creates visual separation while maintaining a cohesive layout structure.

### 3. Edge-to-Edge Content Within Grid

- **Grid items**: Use generous padding (`px-20 py-20`) for content spacing
- **Content spans full width**: No nested max-width constraints within grid cells
- **Sections**: Horizontal padding (`px-6 lg:px-8`) applied at section level, not content level
- **Visual continuity**: Content flows seamlessly within grid boundaries

### 4. Vercel-Inspired Aesthetic

- **Minimal chrome**: Clean, uncluttered interface
- **Black background**: Deep black (`bg-black`) as primary canvas
- **Subtle grid overlay**: 64px grid pattern for structure (`bg-[size:64px_64px]`)
- **Typography-first**: Large, bold headings with tight tracking
- **Purposeful spacing**: Generous whitespace for breathing room

### 5. Simple Premium Gradient

Layered radial gradients create depth without overwhelming:

- **Primary gradient**: Blue-tinted radial gradient from top
  ```css
  radial-gradient(ellipse 80% 60% at 50% top, rgba(99,179,255,0.12), rgba(99,179,255,0.04) 35%, transparent 60%)
  ```

- **Secondary accent**: Subtle blur effect for ambient lighting
  ```css
  radial-gradient(ellipse 80% 60% at 50% top, rgba(147,197,253,0.08), transparent 45%) blur-3xl
  ```

- **Grid pattern overlay**: Subtle white grid lines at 8% opacity
  ```css
  linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
  ```

Gradients are subtle and never compete with content for attention.

### 6. Max Width Container

- **Primary container**: `max-w-6xl` (1152px) for optimal readability
- **Content containers**: Nested `max-w-4xl` or `max-w-3xl` for text-heavy sections
- **Centered alignment**: `mx-auto` for consistent centering
- **Responsive scaling**: Container adapts smoothly across breakpoints

## Layout Patterns

### Section Structure

Each section follows this pattern:
1. Section wrapper with top border (`box-shadow: inset 0 0.1px 0 0 white`)
2. Horizontal padding at section level (`px-6 lg:px-8`)
3. Content container with max-width and padding
4. Edge-to-edge content within grid cells

### Grid Items

Feature grid items use:
- **Padding**: `px-20 py-20` for comfortable spacing
- **Border**: Full inset border (`inset 0 0 0 0.1px white`)
- **Background**: `bg-black` matching page background
- **Hover states**: Subtle icon background transitions (`bg-white/5` to `bg-white/10`)

### Typography Hierarchy

- **Hero headings**: `text-5xl sm:text-6xl lg:text-7xl` with tight tracking
- **Section headings**: `text-3xl sm:text-4xl` or `text-4xl sm:text-5xl`
- **Feature titles**: `text-2xl font-semibold`
- **Body text**: `text-xl` or `text-white/70` for secondary content
- **Descriptions**: `text-white/60` for supporting text

## Color & Contrast

- **Primary background**: `bg-black` for maximum contrast
- **Text hierarchy**: 
  - Primary: `text-white`
  - Secondary: `text-white/70`
  - Tertiary: `text-white/60`
- **Borders**: `white` at 0.1px opacity for subtle definition
- **Interactive elements**: White buttons with black text for high contrast

## Interactive Elements

- **Buttons**: Rounded-full with clear hierarchy
  - Primary: `bg-white text-black`
  - Secondary: `border-white/20 hover:bg-white/5`
- **Links**: Always have `cursor-pointer` class
- **Hover states**: Subtle transitions on icons and interactive elements
- **Focus states**: Clear visual feedback for accessibility

## Implementation Notes

- **Inset shadows over borders**: Uses `box-shadow` inset technique instead of borders for finer control
- **Layered gradients**: Multiple absolute-positioned gradient layers for depth
- **Grid pattern**: Positioned absolutely with `pointer-events-none` to avoid interaction issues
- **Z-index management**: Content in `relative z-10` to sit above background layers

## Responsive Behavior

- **Mobile-first**: Single column layouts by default
- **Grid activation**: `md:grid` breakpoint (768px) for multi-column layouts
- **Padding scaling**: `px-6 lg:px-8` adapts to screen size
- **Typography scaling**: Fluid text sizes with breakpoint adjustments

This design system ensures a clean, structured, and premium-feeling website that guides users through the product without visual clutter.
