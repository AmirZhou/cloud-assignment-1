import { motion } from 'framer-motion';
import MultiLayerCard from './MultiLayerCard';

const ChartCard = ({ title, children, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <MultiLayerCard>
        <h3 className="text-lg font-medium mb-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          {title}
        </h3>
        <div className="h-80 flex items-center justify-center">
          {children}
        </div>
      </MultiLayerCard>
    </motion.div>
  );
};

export default ChartCard;