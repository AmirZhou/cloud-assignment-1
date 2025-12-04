const PerformanceMetric = ({ label, value, color, bold }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ 
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: bold ? 600 : 400,
        fontSize: '0.9375rem'
      }}>
        {label}:
      </span>
      <span style={{ 
        color: `rgba(${color}, 0.95)`,
        fontFamily: 'monospace',
        fontWeight: bold ? 700 : 600,
        fontSize: bold ? '1.125rem' : '1rem'
      }}>
        {value}
      </span>
    </div>
  );
};

export default PerformanceMetric;