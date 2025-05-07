import { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        group relative inline-flex items-center justify-center
        font-bold rounded-full overflow-hidden transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </motion.button>
  );
}