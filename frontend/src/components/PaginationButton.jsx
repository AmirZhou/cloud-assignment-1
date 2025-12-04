import { useState } from 'react';
import { motion } from 'framer-motion';

const PaginationButton = ({ children, onClick, disabled, active }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        background: active
          ? 'linear-gradient(135deg, rgba(66, 133, 244, 0.25), rgba(66, 133, 244, 0.15))'
          : isHovered && !disabled
          ? 'rgba(255, 255, 255, 0.10)'
          : 'rgba(255, 255, 255, 0.06)',
        border: active
          ? '1px solid rgba(66, 133, 244, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        color: active ? 'rgba(66, 133, 244, 0.95)' : 'rgba(255, 255, 255, 0.8)',
        opacity: disabled ? 0.4 : 1,
        boxShadow: isHovered && !disabled
          ? '0 4px 12px rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {children}
    </motion.button>
  );
};

export default PaginationButton;