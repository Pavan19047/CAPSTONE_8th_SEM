import { motion } from 'framer-motion';

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={`bg-gray-700/50 ${variants[variant]} ${className}`}
    />
  );
};

export const SkeletonCard = () => (
  <div className="glass-card p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-8 w-20" variant="rectangular" />
      <Skeleton className="h-8 w-20" variant="rectangular" />
    </div>
  </div>
);

export const SkeletonTicket = () => (
  <div className="glass-card p-6 space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-full" />
      </div>
      <Skeleton className="h-8 w-24" variant="rectangular" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-6 w-16" variant="rectangular" />
      <Skeleton className="h-6 w-20" variant="rectangular" />
    </div>
  </div>
);

export default Skeleton;
