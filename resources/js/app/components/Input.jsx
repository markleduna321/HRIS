import React, { forwardRef } from 'react';

/**
 * Input Component
 * 
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below input
 * @param {string} size - Input size: sm, md, lg
 * @param {boolean} required - Show required asterisk
 * @param {ReactNode} leftIcon - Icon on the left
 * @param {ReactNode} rightIcon - Icon on the right
 * @param {boolean} disabled - Disable the input
 * @param {string} className - Additional CSS classes
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  size = 'md',
  required = false,
  leftIcon,
  rightIcon,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const baseStyles = 'w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';
  
  const inputClasses = `
    ${baseStyles}
    ${stateStyles}
    ${disabledStyles}
    ${sizes[size] || sizes.md}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
