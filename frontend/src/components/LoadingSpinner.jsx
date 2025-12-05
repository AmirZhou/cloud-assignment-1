import { motion } from 'framer-motion';
const LoadingSpinner = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        display: 'inline-block',
        width: '3rem',
        height: '3rem',
        border: '4px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: 'rgba(66, 133, 244, 0.8)',
        borderRadius: '50%',
      }}
    />
  );
};
export default LoadingSpinner;