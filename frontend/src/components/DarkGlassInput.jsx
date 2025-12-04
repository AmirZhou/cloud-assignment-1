import { useState } from 'react';
const DarkGlassInput = ({ type, placeholder, value, onChange, className }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        padding: '0.75rem 1rem',
        background: 'rgba(255, 255, 255, 0.06)',
        border: `1px solid ${isFocused ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.9375rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isFocused 
          ? '0 0 0 3px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    />
  );
};

export default DarkGlassInput;