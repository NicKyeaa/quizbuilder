# AI Coding Agent Instructions for Quiz Builder

## Architecture Overview

This is a Next.js 15 application using the App Router with a client/server component architecture. The app focuses on quiz question management with a modern, animated UI.

**Tech Stack:**

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (with custom HeroUI plugin)
- HeroUI (component library)
- Framer Motion (animations)

## Key Architectural Patterns

### Client/Server Component Split

- **Server Components**: Use for layout and page structure (`layout.tsx`, `page.tsx`)
- **Client Components**: Use `'use client'` directive for interactive features
- **Dynamic Imports**: Use `next/dynamic` for client components to prevent SSR issues (see `ClientLoader.tsx`)

### Component Structure

```tsx
// Server component (default)
export default function Page() {
  return <ClientComponent />;
}

// Client component with dynamic import
const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
});
```

## Design System Requirements

**CRITICAL**: `DESIGN_SYSTEM.md` is the authoritative source for all design decisions, animation patterns, and UI guidelines. This file must be:

- **Always updated** when introducing new design patterns, components, or animations
- **Maintained** as the single source of truth for design system decisions
- **Consulted** before implementing any UI changes or new components
- **Extended** with new patterns discovered during development

### Design System Integration

- All animations must follow the patterns documented in `DESIGN_SYSTEM.md`
- New UI components should be added to the design system documentation
- Performance and accessibility guidelines from the design system are mandatory
- Any deviations from established patterns require design system updates

## Animation System

### Framer Motion Patterns

Always use these specific configurations for consistency:

**Modal Animations:**

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 20 }}
  transition={{
    type: "spring",
    damping: 25,
    stiffness: 300,
    duration: 0.3
  }}
>
```

**Button Interactions:**

```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
```

**Staggered Children:**

```tsx
<motion.div
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }}
  initial="hidden"
  animate="visible"
  transition={{ staggerChildren: 0.1 }}
>
```

### Modal Implementation

- Use `AnimatePresence` for enter/exit animations
- Include backdrop click to close: `onClick={() => setIsModalOpen(false)}`
- Prevent modal close on content click: `onClick={(e) => e.stopPropagation()}`
- Backdrop styling: `fixed inset-0 bg-black/40`

## UI Component Patterns

### HeroUI Integration

- Wrap HeroUI components with Framer Motion for animations
- Use HeroUI's `Button`, `Input`, `Card`, `Select`, `Badge` components
- Apply consistent styling with Tailwind classes

### Search Highlighting

Use inline styles for search term highlighting in tables:

```tsx
<mark
  style={{
    backgroundColor: 'rgb(196, 181, 253)',
    color: '#1f2937',
    padding: '0.125rem 0.25rem',
    borderRadius: '0.125rem',
    fontWeight: '500',
  }}
>
  {highlightedText}
</mark>
```

## Theme System

### Theme Context Usage

```tsx
import { useTheme } from '../ThemeContext';

function Component() {
  const { theme, toggleTheme } = useTheme();
  // theme is 'light' | 'dark'
}
```

- Theme applied via `document.documentElement.classList.add('dark')`
- CSS variables defined in `globals.css` for light/dark modes
- Theme toggle button in `NavMenu.tsx`

## State Management

- Use React `useState` for local component state
- No global state management library currently used
- Data stored locally in component state (questions array in `ClientQuestionManager.tsx`)

## Development Workflow

### Build Commands

```bash
npm run dev    # Development with Turbopack
npm run build  # Production build with Turbopack
npm run start  # Production server
npm run lint   # ESLint checking
```

### File Organization

- `src/app/` - App Router pages and layouts
- `src/app/components/` - Shared components
- Feature-specific folders (e.g., `question-management/`)
- `public/` - Static assets

## Code Quality Standards

### TypeScript

- Strict mode enabled
- Use explicit types for component props and state
- Follow Next.js TypeScript conventions

### Styling

- Prefer Tailwind CSS classes over inline styles
- Use inline styles only for dynamic values (search highlighting, theme variables)
- **MANDATORY**: Follow ALL design system guidelines in `DESIGN_SYSTEM.md` for animations, components, and interactions

### Performance

- Use dynamic imports for client components
- Optimize animations for 60fps (GPU-accelerated properties only)
- Respect `prefers-reduced-motion` for accessibility

## Common Patterns

### Table Implementation

- Use `overflow-x-auto` for responsive tables
- Apply `hover:bg-gray-100` for row hover effects
- Structure: `thead` with `bg-gray-50`, `tbody` with `border-b` rows

### Form Handling

- Controlled components with `useState`
- Direct state updates in `onChange` handlers
- Validation handled at component level

### Navigation

- Use Next.js `Link` component wrapped in HeroUI `Button`
- Navigation structure in `NavMenu.tsx`

## Key Files to Reference

- **`DESIGN_SYSTEM.md`** - **MANDATORY**: Authoritative source for all design decisions, animation patterns, and UI guidelines. Must be updated for any new patterns.
- `src/app/ThemeContext.tsx` - Theme management
- `src/app/question-management/ClientQuestionManager.tsx` - Main feature implementation
- `src/app/ClientLayout.tsx` - Provider setup
- `globals.css` - Tailwind and theme configuration
