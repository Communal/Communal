'use client';

import { forwardRef, useState } from 'react';
import { cn } from '../utils/cn';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export const Input = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const { required, error, type, ...rest } = props;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          required={required}
          ref={ref}
          className={cn(
            'form-control w-full',
            error && 'control-field-error',
            type === 'password' ? 'pr-10 pl-3' : 'px-3'
          )}
          type={
            type === 'password'
              ? showPassword
                ? 'text'
                : 'password'
              : type
          }
          {...rest}
        />
        {type === 'password' && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeIcon className="size-5" />
            ) : (
              <EyeOffIcon className="size-5" />
            )}
          </span>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef((props, ref) => {
  const { resize, required, ...rest } = props;

  return (
    <div className="w-full">
      <textarea
        required={required}
        ref={ref}
        className={cn('form-control w-full px-3', !resize && 'resize-none')}
        {...rest}
      />
    </div>
  );
});

Textarea.displayName = 'Textarea';
