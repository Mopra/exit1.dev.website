# Exit1.dev Website

A modern React application built with Vite, TypeScript, and Tailwind CSS, following strict performance and code quality guidelines.

## 🚀 Tech Stack

- **Framework:** React 18+ with Vite  // Updated for deployment
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3.4
- **Icons:** FontAwesome Pro (to be added)
- **Linting:** ESLint + Prettier
- **Performance:** Optimized for Core Web Vitals

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── utils/         # Utility functions
└── assets/        # Static assets
```

## 🎯 Performance Standards

This project is optimized for:
- **LCP (Largest Contentful Paint):** < 2.5s
- **INP (Interaction to Next Paint):** < 200ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Lighthouse Score:** 90+

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting & Formatting
```bash
npm run lint    # ESLint
npm run format  # Prettier
```

## 📋 Code Conventions

### Components
- Use arrow function syntax
- Destructure props
- Single purpose, under 100 LOC
- Export as default

### Styling
- Tailwind CSS only (no custom CSS)
- Use `@apply` for consistency
- Mobile-first responsive design

### Performance
- Lazy-load non-critical components
- Use `React.memo`, `useMemo`, `useCallback`
- Optimize images and assets
- Minimize bundle size

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance

## 🔧 Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Code formatting
- `vite.config.ts` - Build configuration

## 📦 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Run ESLint
- `format` - Format code with Prettier
