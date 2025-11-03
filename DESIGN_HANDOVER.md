# Premium Glassmorphic Design System Handover

## Overview
This document provides the complete design system specification for the Nutritional Insights Dashboard's premium glassmorphic interface. The design is inspired by modern glassmorphic UI patterns with multi-layer rim lighting effects, adapted for a light theme.

## Core Design Principles

### 1. Glassmorphism
- **Frosted glass effect** using `backdrop-filter: blur(20px)`
- Semi-transparent white backgrounds: `rgba(255, 255, 255, 0.85)`
- Soft, elevated shadows for depth perception
- Smooth transitions on all interactive elements

### 2. Rim Lighting
- Multi-layer border gradients simulating light reflection
- Light source from top (0-30% of gradient)
- Dark edges at bottom for contrast (90-100% of gradient)
- Subtle hover effects that enhance rim visibility

### 3. Animation Philosophy
- Spring physics for natural motion: `{ type: "spring", stiffness: 300, damping: 25 }`
- Vertical lift on hover: `y: -4px`
- Scale transformations: `1.01` for subtle growth
- Smooth opacity transitions: `0.4s ease`

## Color Palette

### Primary Colors
```css
--blue-primary: rgba(99, 102, 241, 1);      /* #6366F1 */
--blue-light: rgba(99, 102, 241, 0.1);
--blue-accent: rgba(99, 102, 241, 0.08);

--green-primary: rgba(16, 185, 129, 1);     /* #10B981 */
--green-light: rgba(16, 185, 129, 0.1);
--green-accent: rgba(16, 185, 129, 0.05);

--purple-primary: rgba(147, 51, 234, 1);    /* #9333EA */
--purple-light: rgba(147, 51, 234, 0.1);
--purple-accent: rgba(147, 51, 234, 0.05);
```

### Background Colors
```css
--bg-gradient-start: #f8f9fa;
--bg-gradient-end: #e9ecef;
--card-background: rgba(255, 255, 255, 0.85);
--card-background-hover: rgba(255, 255, 255, 0.95);
```

### Shadow System
```css
/* Soft elevation shadow */
--shadow-card:
  0 20px 40px rgba(0, 0, 0, 0.04),
  0 10px 20px rgba(0, 0, 0, 0.02),
  inset 0 1px 0 rgba(255, 255, 255, 0.9),
  inset 0 -1px 0 rgba(0, 0, 0, 0.02);

/* Hover elevation */
--shadow-card-hover:
  0 30px 60px rgba(0, 0, 0, 0.06),
  0 15px 30px rgba(0, 0, 0, 0.03),
  0 0 0 1px rgba(99, 102, 241, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 1),
  inset 0 -1px 0 rgba(0, 0, 0, 0.03);

/* Stats card subtle shadow */
--shadow-stats:
  0 10px 20px rgba(0, 0, 0, 0.03),
  0 4px 8px rgba(0, 0, 0, 0.02),
  inset 0 1px 0 rgba(255, 255, 255, 1);
```

## Component Specifications

### Premium Card Component

**Purpose**: Main glassmorphic container with rim lighting

**CSS Implementation**:
```css
.premium-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 1px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.04),
    0 10px 20px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.02);
}

/* Rim lighting gradient border */
.premium-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1.5px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.4) 10%,
    rgba(255, 255, 255, 0.1) 30%,
    transparent 60%,
    rgba(0, 0, 0, 0.02) 90%,
    rgba(0, 0, 0, 0.05) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.6;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.premium-card:hover::before {
  opacity: 1;
}

/* Top highlight - subtle rim light */
.premium-card::after {
  content: '';
  position: absolute;
  top: -1px;
  left: 30%;
  right: 30%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0.9),
    transparent
  );
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.premium-card:hover::after {
  opacity: 1;
}

.premium-card:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.06),
    0 15px 30px rgba(0, 0, 0, 0.03),
    0 0 0 1px rgba(99, 102, 241, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.03);
}
```

**Framer Motion Props**:
```jsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
