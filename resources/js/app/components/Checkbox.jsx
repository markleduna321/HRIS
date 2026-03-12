import React, { forwardRef } from 'react';

/**
 * Checkbox Component
 * 
 * @param {string} label - Checkbox label
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below checkbox
 * @param {boolean} disabled - Disable the checkbox
 * @param {string} size - Checkbox size: sm, md, lg
 * @param {string} className - Additional CSS classes
 */
const Checkbox = forwardRef(({
  label,
  error,
  helperText,
  disabled = false,
  size = 'md',
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const baseStyles = 'rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors';
  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  const errorStyles = error ? 'border-red-300' : '';
  
  const checkboxClasses = `
    ${baseStyles}
    ${disabledStyles}
    ${errorStyles}
    ${sizes[size] || sizes.md}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            className={checkboxClasses}
            {...props}
          />
        </div>
        
        {label && (
          <div className="ml-3">
            <label 
              htmlFor={checkboxId} 
              className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {label}
            </label>
            
            {helperText && !error && (
              <p className="text-sm text-gray-500 mt-0.5">{helperText}</p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 ml-7">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
