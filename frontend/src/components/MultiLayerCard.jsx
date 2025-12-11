import { useState } from 'react';
const MultiLayerCard = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="multi-layer-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="outer-border">
        <div className="border-gap">
          <div className={`inner-border ${isHovered ? 'hovered' : ''}`}>
            <div className={`content-wrapper ${isHovered ? 'hovered' : ''}`}>
              <div className="inner-content">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .multi-layer-container {
          --radius: 24px;
          --outer-border-width: 1.5px;
          --inner-border-width: 1px;
          --gap-between-borders: 6px;

          position: relative;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          height: 100%;
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
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Outer rim light - sharper, more defined */
        .outer-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.12) 1.5%,
            rgba(255, 255, 255, 0.08) 4%,
            rgba(255, 255, 255, 0.04) 8%,
            rgba(255, 255, 255, 0.02) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.04) 85%,
            rgba(0, 0, 0, 0.08) 95%,
            rgba(0, 0, 0, 0.12) 100%
          );
          padding: var(--outer-border-width);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Stronger outer rim light on hover */
        .multi-layer-container:hover .outer-border::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.20) 1.5%,
            rgba(255, 255, 255, 0.14) 4%,
            rgba(255, 255, 255, 0.08) 8%,
            rgba(255, 255, 255, 0.04) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.06) 85%,
            rgba(0, 0, 0, 0.10) 95%,
            rgba(0, 0, 0, 0.16) 100%
          );
        }

        /* Outer specular highlight - sharper */
        .outer-border::after {
          content: '';
          position: absolute;
          top: 0;
          left: 5%;
          right: 5%;
          height: 2px;
          border-radius: var(--radius) var(--radius) 0 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 10%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.6) 90%,
            transparent 100%
          );
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced specular on hover */
        .multi-layer-container:hover .outer-border::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.7) 10%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.7) 90%,
            transparent 100%
          );
          filter: blur(0.5px);
        }

        /* GAP BETWEEN BORDERS */
        .border-gap {
          background: transparent;
          border-radius: calc(var(--radius) - var(--outer-border-width));
          padding: var(--gap-between-borders);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* INNER BORDER - Animated rim light */
        .inner-border {
          position: relative;
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders));
          background: linear-gradient(
            135deg,
            #0a0a0a 0%,
            #0f0f0f 50%,
            #0a0a0a 100%
          );
          padding: var(--inner-border-width);
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Inner rim light - always visible but subtle */
        .inner-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders));
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.10) 0%,
            rgba(255, 255, 255, 0.06) 2%,
            rgba(255, 255, 255, 0.03) 5%,
            transparent 25%,
            rgba(0, 0, 0, 0.03) 90%,
            rgba(0, 0, 0, 0.06) 100%
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

        /* Enhanced inner rim on hover */
        .inner-border.hovered::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.20) 0%,
            rgba(255, 255, 255, 0.14) 2%,
            rgba(255, 255, 255, 0.08) 5%,
            transparent 25%,
            rgba(0, 0, 0, 0.06) 90%,
            rgba(0, 0, 0, 0.10) 100%
          );
        }

        /* Inner specular highlight */
        .inner-border::after {
          content: '';
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 1.5px;
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders)) calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders)) 0 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 15%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.4) 85%,
            transparent 100%
          );
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced inner specular on hover */
        .inner-border.hovered::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 15%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.6) 85%,
            transparent 100%
          );
          filter: blur(0.3px);
        }

        /* CONTENT WRAPPER - Premium lighter grey */
        .content-wrapper {
          position: relative;
          background: linear-gradient(135deg, rgba(25, 25, 28, 0.75) 0%, rgba(20, 20, 23, 0.8) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders) - var(--inner-border-width));
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Subtle ambient glow on hover */
        .content-wrapper.hovered {
          background: linear-gradient(135deg, rgba(30, 30, 33, 0.8) 0%, rgba(25, 25, 28, 0.85) 100%);
        }

        /* Top surface reflection */
        .content-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 35%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.03) 5%,
            rgba(255, 255, 255, 0.015) 15%,
            transparent 100%
          );
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders) - var(--inner-border-width)) calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders) - var(--inner-border-width)) 0 0;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced reflection on hover */
        .content-wrapper.hovered::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 5%,
            rgba(255, 255, 255, 0.02) 15%,
            transparent 100%
          );
        }

        /* Subtle glow from within */
        .content-wrapper::after {
          content: '';
          position: absolute;
          inset: 1px;
          background: radial-gradient(
            ellipse at top center,
            rgba(66, 133, 244, 0.02) 0%,
            transparent 50%
          );
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders) - var(--inner-border-width));
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Show subtle inner glow on hover */
        .content-wrapper.hovered::after {
          opacity: 1;
        }

        /* INNER CONTENT */
        .inner-content {
          position: relative;
          padding: 1.5rem;
          z-index: 1;
          flex: 1;
        }

        @media (max-width: 768px) {
          .inner-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MultiLayerCard;