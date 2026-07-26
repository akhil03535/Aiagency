import React, { forwardRef } from 'react';

/**
 * Labeled input field with inline validation error message.
 * Compatible with react-hook-form register().
 */
const FormField = forwardRef(
  ({ label, error, type = 'text', ...inputProps }, ref) => {
    return (
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>

        <input
          ref={ref}
          type={type}
          className="input-field"
          {...inputProps}
        />

        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;