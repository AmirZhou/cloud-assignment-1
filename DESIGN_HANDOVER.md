# Premium Dark Glassmorphic Design System Handover

## Overview
This document provides the complete design system specification for the Nutritional Insights Dashboard's premium dark glassmorphic interface with multi-layer rim lighting. The design follows the exact aesthetic from your designer friend's work - pure black backgrounds, sophisticated rim lighting, and blue glow effects on hover.

## Core Design Principles

### 1. Dark Glassmorphism
- **Frosted glass effect** using `backdrop-filter: blur(20px)`
- Semi-transparent white overlays on pure black: `rgba(255, 255, 255, 0.06)`
- Deep black shadows for extreme depth
- Pure black (#000000) background

### 2. Multi-Layer Rim Lighting
- **Outer border**: Static white rim light (subtle, always visible)
- **Inner border**: Animated blue rim light (intense on hover)
- **Border gap**: Dark gradient separation layer
- Light source from top (0-30% of gradient)
- Dark shadow at bottom for depth (90-100% of gradient)

### 3. Animation Philosophy
- Spring physics for natural motion: `{ type: "spring", stiffness: 400, damping: 30 }`
- Vertical lift on hover: `y: -2px` (containers), `translateY(-2px)`
- Opacity transitions: `0.5s cubic-bezier(0.4, 0, 0.2, 1)`
- Blue glow fades in on hover with radial gradient

## Color Palette

### Primary Glow Colors (RGB format for CSS variables)
```css
--blue-glow: 66, 133, 244;        /* Stadia blue */
--green-glow: 16, 185, 129;       /* Emerald */
--purple-glow: 147, 51, 234;      /* Amethyst */
--red-glow: 239, 68, 68;          /* Crimson */
```

### Background Colors (Pure Black Theme)
```css
--bg-pure-black: #000000;
--bg-dark-gradient-1: #0a0a0a;
--bg-dark-gradient-2: #0f0f0f;
--bg-dark-gradient-3: #1a1a1a;

/* Content backgrounds with blue tint */
--content-bg-default: linear-gradient(135deg, #0f1922 0%, #0a141c 50%, #060d14 100%);
--content-bg-hover: linear-gradient(135deg, #1a2e3d 0%, #14222e 50%, #0f1a24 100%);

/* Card backgrounds */
--card-outer-border: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
--card-inner-border: linear-gradient(135deg, #0c0c0c 0%, #101010 100%);
--card-inner-border-hover: linear-gradient(135deg, #0f0f0f 0%, #131313 100%);
```

### Shadow System (Deep Black Shadows)
```css
/* Extreme depth shadows for cards */
--shadow-card-outer:
  0 50px 100px rgba(0, 0, 0, 0.9),
  0 25px 50px rgba(0, 0, 0, 0.7),
  0 12px 25px rgba(0, 0, 0, 0.5);

/* Stats card shadows */
--shadow-stats:
  0 20px 40px rgba(0, 0, 0, 0.6),
  0 10px 20px rgba(0, 0, 0, 0.4);

/* Glassmorphic header shadow */
--shadow-header:
  0 20px 40px rgba(0, 0, 0, 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.05),
  inset 0 -1px 0 rgba(0, 0, 0, 0.3);

/* Button shadows */
--shadow-button:
  0 4px 12px rgba(0, 0, 0, 0.2);

--shadow-button-hover:
  0 6px 20px rgba(0, 0, 0, 0.3);
```

### Text Colors
```css
--text-primary: rgba(255, 255, 255, 0.95);
--text-secondary: rgba(255, 255, 255, 0.6);
--text-tertiary: rgba(255, 255, 255, 0.5);
--text-disabled: rgba(255, 255, 255, 0.3);
```

## Component Specifications

### Multi-Layer Rim Light Card Component

**Purpose**: Main container with multi-layer border structure and animated blue rim lighting

**Structure**:
1. **Outer Border** (1.5px): Static white rim light
2. **Border Gap** (6px): Dark gradient separation
3. **Inner Border** (1px): Animated blue rim light on hover
4. **Content Wrapper**: Blue glow from top on hover

**CSS Implementation**:
```css
/* Container */
.multi-layer-container {
  --radius: 24px;
  --outer-border-width: 1.5px;
  --inner-border-width: 1px;
  --gap-between-borders: 6px;

  position: relative;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.multi-layer-container:hover {
  transform: translateY(-2px);
}

/* OUTER BORDER - Static rim light */
.outer-border {
  position: relative;
  border-radius: var(--radius);
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #0f0f0f 50%,
    #0a0a0a 100%
  );
  padding: var(--outer-border-width);
  box-shadow:
    0 50px 100px rgba(0, 0, 0, 0.9),
    0 25px 50px rgba(0, 0, 0, 0.7),
    0 12px 25px rgba(0, 0, 0, 0.5);
}

/* Outer rim light - always visible */
.outer-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.10) 0%,
    rgba(255, 255, 255, 0.07) 1.5%,
    rgba(255, 255, 255, 0.04) 4%,
    rgba(255, 255, 255, 0.02) 8%,
    rgba(255, 255, 255, 0.01) 15%,
    transparent 35%,
    rgba(0, 0, 0, 0.02) 85%,
    rgba(0, 0, 0, 0.04) 95%,
    rgba(0, 0, 0, 0.06) 100%
  );
  padding: var(--outer-border-width);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Outer specular highlight */
.outer-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 35%;
  right: 35%;
  height: 0.5px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.25),
    transparent
  );
  opacity: 0.6;
  pointer-events: none;
}

/* GAP between borders */
.border-gap {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(5, 5, 5, 0.3) 100%
  );
  border-radius: calc(var(--radius) - var(--outer-border-width));
  padding: var(--gap-between-borders);
}

/* INNER BORDER - Animated blue rim on hover */
.inner-border {
  position: relative;
  border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders));
  background: linear-gradient(
    135deg,
    #0c0c0c 0%,
    #101010 100%
  );
  padding: var(--inner-border-width);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.inner-border.hovered {
  background: linear-gradient(
    135deg,
    #0f0f0f 0%,
    #131313 100%
  );
}

/* Inner rim light - subtle by default */
.inner-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.025) 2%,
    rgba(255, 255, 255, 0.015) 5%,
    rgba(255, 255, 255, 0.008) 10%,
    transparent 25%,
    rgba(0, 0, 0, 0.01) 90%,
    rgba(0, 0, 0, 0.02) 100%
  );
  padding: var(--inner-border-width);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Blue illumination on hover */
.inner-border.hovered::before {
  background: linear-gradient(
    180deg,
    rgba(66, 133, 244, 0.3) 0%,
    rgba(66, 133, 244, 0.22) 1.5%,
    rgba(66, 133, 244, 0.15) 3%,
    rgba(66, 133, 244, 0.10) 6%,
    rgba(66, 133, 244, 0.06) 12%,
    rgba(66, 133, 244, 0.03) 20%,
    rgba(66, 133, 244, 0.01) 30%,
    transparent 50%,
    rgba(0, 0, 0, 0.02) 90%,
    rgba(0, 0, 0, 0.04) 100%
  );
  padding: calc(var(--inner-border-width) + 0.3px);
}

/* Inner specular highlight - blue on hover */
.inner-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 25%;
  right: 25%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(66, 133, 244, 0.4),
    rgba(66, 133, 244, 0.6),
    rgba(66, 133, 244, 0.4),
    transparent
  );
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.inner-border.hovered::after {
  opacity: 1;
}

/* CONTENT WRAPPER - Blue glow from top */
.content-wrapper {
  position: relative;
  border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders) - var(--inner-border-width));
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0f1922 0%,
    #0a141c 50%,
    #060d14 100%
  );
  transition: background 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-wrapper.hovered {
  background: linear-gradient(
    135deg,
    #1a2e3d 0%,
    #14222e 50%,
    #0f1a24 100%
  );
}

/* Blue glow emanating from top */
.content-wrapper::before {
  content: '';
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 80%;
  background: radial-gradient(
    ellipse at top center,
    rgba(66, 133, 244, 0.12) 0%,
    rgba(66, 133, 244, 0.08) 15%,
    rgba(66, 133, 244, 0.04) 30%,
    rgba(66, 133, 244, 0.02) 45%,
    transparent 70%
  );
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.content-wrapper.hovered::before {
  opacity: 1;
}

/* Inner content */
.inner-content {
  position: relative;
  padding: 1.5rem;
  z-index: 1;
}
```

**Framer Motion Props**:
```jsx
<motion.div
  whileHover={{ y: -2 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
>
```

### Stats Card Component

**Purpose**: Compact cards with colored accent overlays

**CSS Implementation**:
```css
.stats-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;

  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.03),
    0 4px 8px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 1);

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.stats-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1),    /* Use color based on prop */
    rgba(99, 102, 241, 0.05)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.stats-card:hover::before {
  opacity: 1;
}

.stats-card:hover {
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.05),
    0 8px 16px rgba(0, 0, 0, 0.03),
    0 0 0 1px rgba(99, 102, 241, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}
```

**Framer Motion Props**:
```jsx
<motion.div
  whileHover={{ y: -2, scale: 1.01 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
>
```

### Typography System

```css
/* Dashboard Title */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
}

/* Section Headers */
h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.02em;
}

/* Stats Card Title */
h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Stats Card Value */
.stats-value {
  font-size: 2rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
}

/* Body Text */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
               'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  color: rgba(0, 0, 0, 0.75);
}
```

## Layout Specifications

### Grid System
```css
/* Main container */
max-width: 1600px;
margin: 0 auto;
padding: 2rem;

/* Stats grid */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: 1.5rem;

/* Chart grid */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
gap: 2rem;
```

### Spacing Scale
```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
```

### Border Radius Scale
```css
--radius-sm: 12px;    /* Small elements, buttons */
--radius-md: 20px;    /* Stats cards */
--radius-lg: 24px;    /* Premium cards */
--radius-xl: 28px;    /* Large containers */
```

## Interactive Elements

### Button Styles
```css
button {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

button:hover {
  background: white;
  border-color: rgba(99, 102, 241, 0.2);
  color: rgba(99, 102, 241, 1);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(99, 102, 241, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

button.active {
  background: rgba(99, 102, 241, 1);
  color: white;
  border-color: transparent;
  box-shadow:
    0 4px 12px rgba(99, 102, 241, 0.3),
    inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

### Search Input
```css
input[type="text"] {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: rgba(0, 0, 0, 0.85);
  transition: all 0.2s ease;

  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 1px 0 rgba(255, 255, 255, 1);
}

input[type="text"]:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow:
    0 0 0 3px rgba(99, 102, 241, 0.05),
    inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

input[type="text"]::placeholder {
  color: rgba(0, 0, 0, 0.4);
}
```

## Chart Styling

### Chart Container
```css
.chart-container {
  position: relative;
  height: 400px;
  padding: 2rem;
}
```

### Chart.js Theme Configuration
```javascript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgba(0, 0, 0, 0.7)',
        font: {
          size: 12,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
        },
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: 'rgba(0, 0, 0, 0.85)',
      bodyColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      cornerRadius: 8,
      titleFont: {
        size: 13,
        weight: '600'
      },
      bodyFont: {
        size: 12
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: 'rgba(0, 0, 0, 0.5)',
        font: {
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(0, 0, 0, 0.5)',
        font: {
          size: 11
        }
      }
    }
  }
};
```

## Animation Guidelines

### Timing Functions
```css
/* Smooth ease */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

/* Bounce back */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Quick snap */
--ease-snap: cubic-bezier(0.4, 0, 1, 1);
```

### Framer Motion Variants
```javascript
// Card entrance animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

## Implementation Files

### Core Components
- `frontend/src/components/DashboardPremium.jsx` - Main dashboard implementation
- `frontend/src/components/PremiumCard.jsx` - Reusable glassmorphic card components
- `frontend/src/App.jsx` - Application entry point

### Dependencies Required
```json
{
  "framer-motion": "^10.18.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "tailwindcss": "^3.3.6"
}
```

## Design Inspiration Source

The design system is inspired by these reference files:
- `GlassmorphicTogglePreview.jsx` - Toggle switches with glassmorphism
- `PremiumMultiLayer.jsx` - Multi-layer rim lighting technique
- `RimLightContainer.jsx` - Various rim lighting implementations

## Quality Checklist

When implementing or extending this design system, ensure:

- [ ] All glassmorphic elements use `backdrop-filter: blur(20px)`
- [ ] Rim lighting gradients always flow from light (top) to dark (bottom)
- [ ] Hover states increase both elevation and rim light opacity
- [ ] Spring animations use consistent stiffness (300-400) and damping (25-30)
- [ ] Shadows follow the elevation system (card → stats → button)
- [ ] Color overlays on stats cards match the data category (blue/green/purple)
- [ ] Border radius matches component size (12px → 20px → 24px)
- [ ] All transitions use cubic-bezier for smooth motion
- [ ] Typography hierarchy is maintained (title → section → label → value)
- [ ] Interactive elements have visible focus states for accessibility

## Browser Compatibility Notes

- `backdrop-filter` requires `-webkit-` prefix for Safari
- `-webkit-mask-composite: xor` for Safari, `mask-composite: exclude` for others
- Test glassmorphic effects on various background patterns
- Ensure sufficient color contrast for accessibility (WCAG AA minimum)

## Next Steps for Developers

1. **Review existing implementation**: Study `DashboardPremium.jsx` and `PremiumCard.jsx`
2. **Understand the layering**: Note how `::before` and `::after` create multi-layer effects
3. **Experiment with variants**: Try different rim lighting angles and intensities
4. **Extend components**: Create new glassmorphic components following the same patterns
5. **Test interactions**: Ensure all hover states feel smooth and responsive
6. **Optimize performance**: Use `will-change` for animated properties if needed

## Contact & Resources

- Design reference files located in project root
- Framer Motion docs: https://www.framer.com/motion/
- Chart.js customization: https://www.chartjs.org/docs/
- Glassmorphism generator: https://hype4.academy/tools/glassmorphism-generator

---

**Design System Version**: 1.0
**Last Updated**: Phase 2 - Design Enhancement
**Branch**: `design-enhancement`
