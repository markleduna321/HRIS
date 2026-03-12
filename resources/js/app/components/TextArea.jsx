import React, { forwardRef } from 'react';

/**
 * TextArea Component
 * 
 * @param {string} label - TextArea label
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below textarea
 * @param {number} rows - Number of rows
 * @param {boolean} required - Show required asterisk
 * @param {boolean} disabled - Disable the textarea
 * @param {boolean} resize - Allow manual resize
 * @param {string} className - Additional CSS classes
 */
const TextArea = forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  required = false,
  disabled = false,
  resize = true,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseStyles = 'w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm';
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';
  const resizeStyles = resize ? 'resize-y' : 'resize-none';
  
  const textareaClasses = `
    ${baseStyles}
    ${stateStyles}
    ${disabledStyles}
    ${resizeStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
