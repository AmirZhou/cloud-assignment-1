import { useState } from 'react';
import { motion } from 'framer-motion';

const InsightCard = ({ icon, title, value, subtitle, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(25, 25, 28, 0.6), rgba(20, 20, 23, 0.7))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${isHovered ? `rgba(${color}, 0.3)` : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '20px',
        boxShadow: isHovered 
          ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(${color}, 0.1)`
          : '0 20px 40px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h4 style={{
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '0.5rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </h4>
      <p style={{
        fontSize: '1.125rem',
        fontWeight: 600,
        color: `rgba(${color}, 0.95)`,
        marginBottom: '0.25rem',
        lineHeight: '1.4'
      }}>
        {value}
      </p>
      {subtitle && (
        <p style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)'
        }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default InsightCard;