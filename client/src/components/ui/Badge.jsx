import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-700 text-text-primary',
    primary: 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30',
    success: 'bg-accent-success/20 text-accent-success border border-accent-success/30',
    warning: 'bg-accent-warning/20 text-accent-warning border border-accent-warning/30',
    error: 'bg-accent-error/20 text-accent-error border border-accent-error/30',
    info: 'bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30',
    
    // Status badges
    open: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    resolved: 'bg-green-500/20 text-green-400 border border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    
    // Priority badges
    low: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    urgent: 'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`badge ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
