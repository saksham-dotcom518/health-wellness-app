import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, delay = 0, style = {}, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`glass ${className}`}
      style={{
        padding: '20px 24px',
        transition: 'all 0.3s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
