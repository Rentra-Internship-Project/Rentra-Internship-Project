import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  loading = false,
  ...props
}) => {
  const baseStyles = 'btn flex items-center justify-center gap-2 font-semibold transition-all duration-200';

  const variants = {
    primary: 'bg-[#CCCCFF] hover:bg-[#B8B8FF] text-[#0F172A] shadow-xs active:scale-[0.98]',
    secondary: 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] active:scale-[0.98]',
    outline: 'border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] active:scale-[0.98]',
    danger: 'bg-[#EF4444] hover:bg-red-600 text-white shadow-xs active:scale-[0.98]',
    success: 'bg-[#22C55E] hover:bg-emerald-600 text-white shadow-xs active:scale-[0.98]',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-[11px] rounded-[8px]',
    sm: 'px-3 py-1.5 text-xs rounded-[10px]',
    md: 'px-4 py-2 text-sm rounded-[12px]',
    lg: 'px-6 py-3 text-base rounded-[14px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="text-lg shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
