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
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[12px] transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] shadow-sm font-semibold',
    secondary: 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155]',
    danger: 'bg-[#EF4444] hover:bg-red-600 text-white shadow-sm',
    success: 'bg-[#22C55E] hover:bg-green-600 text-white shadow-sm',
    warning: 'bg-[#F59E0B] hover:bg-amber-600 text-white shadow-sm',
    outline: 'border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="text-current text-base" />}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
