import { motion } from 'framer-motion';
import { useState } from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: focused || props.value ? -24 : 0,
            scale: focused || props.value ? 0.85 : 1,
            color: focused ? '#6366F1' : '#9CA3AF'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 top-3 pointer-events-none origin-left"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
        )}
        
        <input
          className={`input-field ${Icon ? 'pl-12' : ''} ${error ? 'border-accent-error' : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent-error text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
