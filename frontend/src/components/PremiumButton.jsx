import { useState } from 'react';
import { motion } from 'framer-motion';

const PremiumButton = ({ children, onClick, disabled, variant = 'primary' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStyle = () => {
    if (variant === 'primary') {
      return {
        background: isHovered && !disabled 
          ? 'linear-gradient(135deg, rgba(66, 133, 244, 0.35), rgba(66, 133, 244, 0.25))'
          : 'linear-gradient(135deg, rgba(66, 133, 244, 0.25), rgba(66, 133, 244, 0.15))',
        border: '1px solid rgba(66, 133, 244, 0.4)',
        color: 'rgba(66, 133, 244, 0.95)'
      };
    }
    return {
      background: isHovered && !disabled
        ? 'rgba(255, 255, 255, 0.10)'
        : 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: 'rgba(255, 255, 255, 0.85)'
    };
  };

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        ...getStyle(),
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontSize: '0.9375rem',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isHovered && !disabled 
          ? '0 8px 24px rgba(0, 0, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
    >
      {children}
    </motion.button>
  );
};

export default PremiumButton;