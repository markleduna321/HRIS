import React, { forwardRef } from 'react';

/**
 * Select Component
 * 
 * @param {string} label - Select label
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below select
 * @param {string} size - Select size: sm, md, lg
 * @param {boolean} required - Show required asterisk
 * @param {boolean} disabled - Disable the select
 * @param {Array} options - Array of {value, label} objects
 * @param {string} placeholder - Placeholder option
 * @param {string} className - Additional CSS classes
 */
const Select = forwardRef(({
  label,
  error,
  helperText,
  size = 'md',
  required = false,
  disabled = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
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
  
  const selectClasses = `
    ${baseStyles}
    ${stateStyles}
    ${disabledStyles}
    ${sizes[size] || sizes.md}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
