import { useState } from 'react';

const DarkGlassSelect = ({ children, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="dark-glass-select"
        style={{
          padding: '0.75rem 2.5rem 0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.06)',
          border: `1px solid ${isFocused ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '12px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9375rem',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: isFocused
            ? '0 0 0 3px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.2)'
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.6)' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          minWidth: '200px'
        }}
      >
        {children}
      </select>
      
      <style>{`
        .dark-glass-select option {
          background-color: #1a1a1a !important;
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 0.75rem 1rem;
          font-weight: 500;
        }

        .dark-glass-select option:hover {
          background-color: #252525 !important;
        }

        .dark-glass-select option:checked {
          background-color: #2a2a2a !important;
        }
      `}</style>
    </>
  );
};

export default DarkGlassSelect;