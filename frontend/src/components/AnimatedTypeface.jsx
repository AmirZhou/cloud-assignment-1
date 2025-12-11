import { useState, useEffect, useRef } from 'react';
import './AnimatedTypeface.css';

// Character path definitions
const CHARACTER_PATHS = {
  A: "M 5 70 L 25 10 L 45 70 M 12 50 L 38 50",
  B: "M 10 70 L 10 10 L 35 10 Q 45 10 45 20 Q 45 30 35 30 L 10 30 L 37 30 Q 47 30 47 40 Q 47 50 37 50 Q 47 50 47 60 Q 47 70 37 70 L 10 70",
  C: "M 45 20 Q 45 10 35 10 L 20 10 Q 10 10 10 20 L 10 60 Q 10 70 20 70 L 35 70 Q 45 70 45 60",
  D: "M 10 70 L 10 10 L 30 10 Q 45 10 45 25 L 45 55 Q 45 70 30 70 Z",
  E: "M 45 10 L 10 10 L 10 70 L 45 70 M 10 40 L 40 40",
  F: "M 45 10 L 10 10 L 10 70 M 10 40 L 40 40",
  G: "M 45 20 Q 45 10 35 10 L 20 10 Q 10 10 10 20 L 10 60 Q 10 70 20 70 L 35 70 Q 45 70 45 60 L 45 45 L 30 45",
  H: "M 10 10 L 10 70 M 40 10 L 40 70 M 10 40 L 40 40",
  I: "M 15 10 L 35 10 M 25 10 L 25 70 M 15 70 L 35 70",
  J: "M 20 10 L 40 10 M 30 10 L 30 60 Q 30 70 20 70 Q 10 70 10 60",
  K: "M 10 10 L 10 70 M 45 10 L 10 40 L 45 70",
  L: "M 10 10 L 10 70 L 45 70",
  M: "M 5 70 L 5 10 L 25 40 L 45 10 L 45 70",
  N: "M 10 70 L 10 10 L 40 70 L 40 10",
  O: "M 25 10 A 20 30 0 0 0 25 70 A 20 30 0 0 0 25 10",
  P: "M 10 70 L 10 10 L 35 10 Q 45 10 45 20 Q 45 30 35 30 L 10 30",
  Q: "M 25 10 A 20 30 0 0 0 25 70 A 20 30 0 0 0 25 10 M 35 55 L 45 70",
  R: "M 10 70 L 10 10 L 35 10 Q 45 10 45 20 Q 45 30 35 30 L 10 30 M 30 30 L 45 70",
  S: "M 40 20 Q 40 10 30 10 L 20 10 Q 10 10 10 20 Q 10 30 20 30 L 30 30 Q 40 30 40 40 Q 40 50 40 60 Q 40 70 30 70 L 20 70 Q 10 70 10 60",
  T: "M 5 10 L 45 10 M 25 10 L 25 70",
  U: "M 10 10 L 10 55 Q 10 70 25 70 Q 40 70 40 55 L 40 10",
  V: "M 5 10 L 25 70 L 45 10",
  W: "M 2 10 L 12 70 L 25 40 L 38 70 L 48 10",
  X: "M 10 10 L 40 70 M 40 10 L 10 70",
  Y: "M 10 10 L 25 40 L 40 10 M 25 40 L 25 70",
  Z: "M 10 10 L 40 10 L 10 70 L 40 70"
};

// Animation variants
const ANIMATION_VARIANTS = {
  draw: {
    initial: { pathLength: 0, opacity: 1 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.5, ease: "easeInOut" }
  },
  fade: {
    initial: { opacity: 0, y: 0 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  slide: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  scale: {
    initial: { scale: 0, opacity: 1 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "backOut" }
  },
  rotate: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  morph: {
    initial: { pathLength: 0, strokeWidth: 6 },
    animate: { pathLength: 1, strokeWidth: 3 },
    transition: { duration: 1, ease: "easeInOut" }
  }
};

// Individual character component
const AnimatedCharacter = ({
  char,
  index = 0,
  animation = 'draw',
  delay = 0,
  color = '#667eea',
  size = 50,
  onAnimationComplete,
  interactive = false,
  randomInterval = null // Auto-trigger random animations at this interval (ms)
}) => {
  const [animState, setAnimState] = useState('idle'); // 'idle', 'animating'
  const [currentAnimation, setCurrentAnimation] = useState(animation);
  const [animKey, setAnimKey] = useState(0); // Force re-render for CSS animations
  const pathRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const charPath = CHARACTER_PATHS[char.toUpperCase()];

  // Initial draw animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimState('animating');
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, ANIMATION_VARIANTS[currentAnimation].transition.duration * 1000);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Random animation interval - runs forever
  useEffect(() => {
    if (!randomInterval) return;

    const triggerRandomAnimation = () => {
      const animations = Object.keys(ANIMATION_VARIANTS);
      const randomAnim = animations[Math.floor(Math.random() * animations.length)];

      // Reset to initial state first - remove animation class
      setAnimState('idle');

      // Small delay to ensure DOM updates, then set new animation
      timeoutRef.current = setTimeout(() => {
        setCurrentAnimation(randomAnim);
        setAnimKey(k => k + 1); // Force fresh key to restart CSS animation

        // Another small delay then trigger animating state
        setTimeout(() => {
          setAnimState('animating');
        }, 20);
      }, 30);
    };

    // Start random animations after initial animation completes
    const startDelay = delay + 2000 + (Math.random() * randomInterval);

    const initialTimeout = setTimeout(() => {
      triggerRandomAnimation();

      // Set up recurring interval
      intervalRef.current = setInterval(() => {
        // Random chance to trigger (30%)
        if (Math.random() < 0.3) {
          triggerRandomAnimation();
        }
      }, randomInterval);
    }, startDelay);

    return () => {
      clearTimeout(initialTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [randomInterval, delay]);

  const getPathLength = () => {
    if (pathRef.current) {
      try {
        return pathRef.current.getTotalLength();
      } catch {
        return 300;
      }
    }
    return 300;
  };

  if (!charPath) return null;

  const pathLength = getPathLength();
  const isAnimating = animState === 'animating';

  // CSS class-based animation approach (like the HTML example)
  const getAnimationClass = () => {
    if (!isAnimating) return '';
    return `anim-${currentAnimation}`;
  };

  // Get initial style when not animating (before animation plays)
  const getInitialStyle = () => {
    if (isAnimating) {
      return { overflow: 'visible' };
    }
    // Initial hidden states based on animation type
    switch (currentAnimation) {
      case 'fade':
        return { overflow: 'visible', opacity: 0 };
      case 'scale':
        return { overflow: 'visible', transform: 'scale(0)' };
      case 'rotate':
        return { overflow: 'visible', transform: 'rotate(-180deg)', opacity: 0 };
      case 'slide':
        return { overflow: 'visible', transform: 'translateY(-20px)', opacity: 0 };
      default:
        return { overflow: 'visible' };
    }
  };

  return (
    <div
      className="animated-char-container no-hover"
      style={{
        width: size,
        height: size * 1.6,
        cursor: 'default'
      }}
    >
      <svg
        key={`${currentAnimation}-${animKey}`}
        viewBox="0 0 50 80"
        width="100%"
        height="100%"
        className={getAnimationClass()}
        style={getInitialStyle()}
      >
        <path
          ref={pathRef}
          d={charPath}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="char-path"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: (currentAnimation === 'draw' || currentAnimation === 'morph') && !isAnimating ? pathLength : 0
          }}
        />
      </svg>
    </div>
  );
};

// Main typeface component
const AnimatedTypeface = ({
  text = "HELLO",
  animation = 'draw',
  stagger = 100,
  loop = false,
  loopDelay = 2000,
  colorScheme = 'gradient', // 'gradient', 'solid', 'custom'
  customColors = [],
  size = 60,
  className = "",
  onComplete,
  randomInterval = 3000 // Auto-trigger random animations every ~3s per character
}) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!loop) return;

    const totalDuration = text.length * stagger + ANIMATION_VARIANTS[animation].transition.duration * 1000;
    const interval = setInterval(() => {
      setKey(k => k + 1);
    }, totalDuration + loopDelay);

    return () => clearInterval(interval);
  }, [loop, loopDelay, text, stagger, animation]);

  const getColor = (index) => {
    if (colorScheme === 'solid') {
      return '#667eea';
    } else if (colorScheme === 'custom' && customColors.length > 0) {
      return customColors[index % customColors.length];
    } else {
      // Gradient
      const hue = 270 + index * 15;
      return `hsl(${hue}, 70%, 70%)`;
    }
  };

  const chars = text.toUpperCase().split('');

  return (
    <div className={`animated-typeface ${className}`} key={key}>
      {chars.map((char, index) => (
        <AnimatedCharacter
          key={`${char}-${index}`}
          char={char}
          index={index}
          animation={animation}
          delay={index * stagger}
          color={getColor(index)}
          size={size}
          onAnimationComplete={index === chars.length - 1 ? onComplete : undefined}
          randomInterval={randomInterval}
        />
      ))}
    </div>
  );
};

// Character grid showcase
export const CharacterGrid = ({ 
  onCharSelect,
  highlightedChars = [] 
}) => {
  const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  return (
    <div className="character-grid">
      {allChars.map(char => (
        <div 
          key={char}
          className={`grid-char ${highlightedChars.includes(char) ? 'highlighted' : ''}`}
          onClick={() => onCharSelect && onCharSelect(char)}
        >
          <AnimatedCharacter
            char={char}
            animation="fade"
            color={highlightedChars.includes(char) ? '#667eea' : '#888'}
            size={40}
            interactive={true}
          />
          <span className="char-label">{char}</span>
        </div>
      ))}
    </div>
  );
};

// Usage example component
export const TypefaceDemo = () => {
  const [currentText, setCurrentText] = useState("RAHC");
  const [currentAnimation, setCurrentAnimation] = useState("draw");
  
  return (
    <div className="typeface-demo">
      <div className="controls">
        <input 
          type="text" 
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value.slice(0, 10))}
          placeholder="Enter text..."
          maxLength={10}
        />
        
        <select 
          value={currentAnimation} 
          onChange={(e) => setCurrentAnimation(e.target.value)}
        >
          {Object.keys(ANIMATION_VARIANTS).map(anim => (
            <option key={anim} value={anim}>{anim}</option>
          ))}
        </select>
        
        <button onClick={() => setCurrentText(currentText + ' ')}>
          Replay
        </button>
      </div>
      
      <AnimatedTypeface
        text={currentText}
        animation={currentAnimation}
        stagger={100}
        colorScheme="gradient"
        size={80}
        onComplete={() => console.log('Animation complete!')}
      />
      
      <CharacterGrid 
        highlightedChars={currentText.split('')}
        onCharSelect={(char) => setCurrentText(currentText + char)}
      />
    </div>
  );
};

// Export all components
export default AnimatedTypeface;
export { AnimatedCharacter, CHARACTER_PATHS, ANIMATION_VARIANTS };