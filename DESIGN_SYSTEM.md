# Design System & Animation Principles

## Overview

This document outlines the design principles, animation guidelines, and user experience standards for our web applications. These principles ensure consistency, accessibility, and delightful user interactions across all platforms.

## Core Design Principles

### 1. **User-Centric Design**

- **Accessibility First**: All interactions must be accessible to users with disabilities
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with it
- **Inclusive Design**: Consider diverse user needs, abilities, and contexts
- **Clear Hierarchy**: Use typography, spacing, and color to guide user attention

### 2. **Performance & Efficiency**

- **Fast Loading**: Optimize for <100ms perceived performance
- **Efficient Animations**: Use GPU-accelerated animations (transform, opacity)
- **Minimal Bundle Size**: Only include necessary dependencies
- **Lazy Loading**: Load content and components as needed

### 3. **Consistency & Predictability**

- **Design Tokens**: Use consistent spacing, colors, typography, and timing
- **Component Library**: Standardized reusable components
- **Interaction Patterns**: Familiar gestures and behaviors
- **Visual Language**: Consistent iconography and illustration style

## Animation Principles

### 1. **Purpose-Driven Animation**

- **Functional**: Animations should serve a purpose (feedback, orientation, delight)
- **Meaningful**: Each animation should communicate something to the user
- **Appropriate**: Match animation intensity to the importance of the action
- **Non-Intrusive**: Don't distract from primary tasks

### 2. **Timing & Easing**

- **Natural Motion**: Use easing curves that mimic real-world physics
- **Consistent Duration**: Standard durations for similar interactions
  - Micro-interactions: 150-200ms
  - Page transitions: 300-500ms
  - Modal entrance: 300-400ms
- **Spring Physics**: Use spring animations for organic, bouncy feel
- **Staggered Animations**: Sequence related elements for visual flow

### 3. **Animation Hierarchy**

- **Primary Actions**: Most prominent, satisfying feedback
- **Secondary Actions**: Subtle but noticeable
- **Background Elements**: Minimal or no animation
- **Error States**: Attention-grabbing but not alarming

## Component-Specific Guidelines

### Modals & Overlays

- **Entrance**: Scale from 90% to 100% with fade-in (300ms spring)
- **Exit**: Scale to 90% with fade-out (200ms)
- **Backdrop**: Fade in/out with modal content
- **Content**: Stagger child elements (50ms delay between each)
- **Interaction**: Click backdrop to close, prevent close on content click

### Buttons & Interactive Elements

- **Hover**: Subtle scale (1.02x) or color transition
- **Active/Pressed**: Scale down (0.98x) for tactile feedback
- **Focus**: Clear focus indicators for keyboard navigation
- **Loading States**: Smooth transition to loading spinner
- **Success States**: Satisfying scale and color change

### Forms & Inputs

- **Focus Transitions**: Smooth border color and shadow changes
- **Validation**: Gentle shake for errors, success checkmark animation
- **Progressive Disclosure**: Animate in additional fields smoothly
- **Auto-complete**: Smooth dropdown with staggered item appearance

### Navigation & Transitions

- **Page Transitions**: Slide/fade between routes (400ms)
- **Tab Switching**: Instant with subtle content fade
- **Menu Expansion**: Smooth height/width transitions
- **Breadcrumb Navigation**: Animate path changes

### Tables & Data Display

- **Search Highlighting**: Use violet background for search term highlighting
  - Inline styles: `backgroundColor: 'rgb(196, 181, 253)', color: '#1f2937', padding: '0.125rem 0.25rem', borderRadius: '0.125rem', fontWeight: '500'`
  - Apply to all table cells containing searchable text
  - Ensures consistent rendering across all browsers
- **Row Hover**: Subtle background color change on table row hover
- **Sorting Indicators**: Clear visual indicators for sortable columns
- **Empty States**: Friendly messaging with clear call-to-action buttons

## Technical Implementation

### Framer Motion Best Practices

```typescript
// Modal Animation
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

// Button Hover
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>

// Staggered Children
<motion.div
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }}
  initial="hidden"
  animate="visible"
  transition={{ staggerChildren: 0.1 }}
>
  <motion.child variants={itemVariants} />
</motion.div>
```

### CSS Animation Guidelines

- **Prefer CSS Transforms**: Use `transform` and `opacity` for GPU acceleration
- **Avoid Layout Triggers**: Don't animate properties that cause reflow
- **Use `will-change`**: For complex animations, hint browser optimization
- **Respect `prefers-reduced-motion`**: Disable animations for users who prefer less motion

### Performance Considerations

- **60fps Target**: All animations should maintain smooth 60fps
- **Bundle Splitting**: Lazy load animation libraries if not critical
- **Conditional Loading**: Only load Framer Motion on pages that need it
- **Animation Budget**: Limit concurrent animations to prevent jank

## Accessibility Guidelines

### Motion & Animation

- **Respect User Preferences**: Honor `prefers-reduced-motion` setting
- **Provide Alternatives**: Ensure functionality works without animations
- **Clear Focus Indicators**: Animated focus states that are visible
- **Screen Reader Friendly**: Don't rely on animation for critical information

### Interaction Feedback

- **Visual Feedback**: Clear indication of interactive elements
- **Haptic Feedback**: Consider device vibration for mobile
- **Audio Cues**: Optional sound feedback for important actions
- **Color Independence**: Don't rely solely on color for feedback

## Testing & Quality Assurance

### Animation Testing Checklist

- [ ] Animations work on all supported devices and browsers
- [ ] Performance is smooth (60fps) on target devices
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Focus management works with animations
- [ ] Screen readers announce animated content appropriately
- [ ] Animations don't cause accessibility issues

### User Testing Focus Areas

- [ ] Animation timing feels natural and responsive
- [ ] Users understand what animations communicate
- [ ] Animations enhance rather than distract from tasks
- [ ] Loading states provide appropriate feedback
- [ ] Error states are clear but not alarming

## Implementation Checklist

### For Each New Feature

- [ ] Does this animation serve a clear purpose?
- [ ] Is the timing appropriate for the action's importance?
- [ ] Does it work well on mobile devices?
- [ ] Is it accessible and respects user preferences?
- [ ] Does it perform well on lower-end devices?
- [ ] Is it consistent with existing animation patterns?

### Code Review Questions

- [ ] Are animations using GPU-accelerated properties?
- [ ] Is AnimatePresence used for enter/exit animations?
- [ ] Are animation variants defined for reusability?
- [ ] Is performance monitored and optimized?
- [ ] Are accessibility considerations addressed?

## Maintenance & Evolution

### Regular Audits

- Conduct quarterly animation audits
- Update animation library dependencies
- Test on new devices and browsers
- Gather user feedback on animation preferences

### Documentation Updates

- Keep this document current with new patterns
- Document new animation components
- Update examples with best practices
- Share learnings from user testing

Remember: Good animation is invisible. When done right, users notice the smoothness and responsiveness, not the animations themselves.
