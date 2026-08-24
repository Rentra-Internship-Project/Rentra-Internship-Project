import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[12px] transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] shadow-sm font-semibold',
    secondary: 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155]',
    danger: 'bg-[#EF4444] hover:bg-red-600 text-white shadow-sm',
    success: 'bg-[#22C55E] hover:bg-green-600 text-white shadow-sm',
    warning: 'bg-[#F59E0B] hover:bg-amber-600 text-white shadow-sm',
    outline: 'border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]',
    custom: '' // Allow completely custom styles
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] !== undefined ? variants[variant] : variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        Icon && <Icon className="text-current text-base" />
      )}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
