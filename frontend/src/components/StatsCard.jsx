import MultiLayerCard from './MultiLayerCard';

const StatsCard = ({ title, value, subtitle, color }) => {
  return (
    <MultiLayerCard>
      <h3 style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.75rem'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '2.5rem',
        fontWeight: 300,
        color: `rgba(${color}, 0.95)`,
        lineHeight: 1,
        marginBottom: subtitle ? '0.5rem' : 0
      }}>
        {value}
      </p>
      {subtitle && (
        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.4)',
          fontWeight: 400
        }}>
          {subtitle}
        </p>
      )}
    </MultiLayerCard>
  );
};
export default StatsCard;