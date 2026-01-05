import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 active:scale-[0.97] inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-accent-primary hover:bg-accent-primary/90 text-white hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-primary-card hover:bg-gray-700 text-text-primary border border-gray-700 disabled:opacity-50',
    success: 'bg-accent-success hover:bg-accent-success/90 text-white disabled:opacity-50',
    danger: 'bg-accent-error hover:bg-accent-error/90 text-white disabled:opacity-50',
    ghost: 'hover:bg-primary-card text-text-primary disabled:opacity-50',
    outline: 'border-2 border-accent-primary text-accent-primary hover:bg-accent-primary/10 disabled:opacity-50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
