import React from 'react';

/**
 * RadioGroup Component
 * Wrapper for multiple Radio options
 * 
 * @param {string} label - Group label
 * @param {string} error - Error message
 * @param {Array} options - Array of {value, label, helperText} objects
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler
 * @param {boolean} required - Show required asterisk
 * @param {string} direction - Layout direction: horizontal, vertical
 */
const RadioGroup = ({
  label,
  error,
  options = [],
  value,
  onChange,
  required = false,
  direction = 'vertical',
  name,
  disabled = false,
  className = '',
}) => {
  const groupId = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  
  const containerClasses = direction === 'horizontal' 
    ? 'flex flex-wrap gap-4' 
    : 'space-y-3';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={containerClasses}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`${groupId}-${option.value}`}
                name={groupId}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange && onChange(e.target.value)}
                disabled={disabled || option.disabled}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="ml-3">
              <label 
                htmlFor={`${groupId}-${option.value}`}
                className={`text-sm font-medium ${disabled || option.disabled ? 'text-gray-400' : 'text-gray-700'} ${disabled || option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option.label}
              </label>
              {option.helperText && (
                <p className="text-sm text-gray-500 mt-0.5">{option.helperText}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;
