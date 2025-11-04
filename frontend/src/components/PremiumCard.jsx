import { motion } from 'framer-motion';

// Premium Glass Card - Light Theme
// Inspired by glassmorphic designs with rim lighting adapted for light backgrounds

export const PremiumCard = ({ children, className = '', hoverable = true }) => {
  return (
    <motion.div
      className={`premium-card ${className}`}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
      <style jsx>{`
        .premium-card {
          position: relative;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 1px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

          /* Soft elevated shadow */
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.04),
            0 10px 20px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.02);
        }

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
      `}</style>
    </motion.div>
  );
};

// Stats Card with Multi-Layer Border
export const StatsCard = ({ title, value, icon, color = "blue" }) => {
  const colors = {
    blue: { from: 'rgba(99, 102, 241, 0.1)', to: 'rgba(99, 102, 241, 0.05)' },
    green: { from: 'rgba(16, 185, 129, 0.1)', to: 'rgba(16, 185, 129, 0.05)' },
    purple: { from: 'rgba(147, 51, 234, 0.1)', to: 'rgba(147, 51, 234, 0.05)' },
  };

  return (
    <motion.div
      className="stats-card"
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="stats-content">
        {icon && <div className="stats-icon">{icon}</div>}
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
      <style jsx>{`
        .stats-card {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;

          /* Subtle shadow */
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
            ${colors[color].from},
            ${colors[color].to}
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

        .stats-content {
          position: relative;
          z-index: 1;
        }

        .stats-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        h3 {
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.5);
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        p {
          font-size: 32px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.9);
          margin: 0;
        }
      `}</style>
    </motion.div>
  );
};

export default PremiumCard;
