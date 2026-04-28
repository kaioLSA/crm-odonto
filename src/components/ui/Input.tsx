import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from './cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, label, error, ...props }, ref) => (
    <label className="block w-full">
      {label && (
        <span className="block text-xs font-medium text-slate-400 mb-1.5">
          {label}
        </span>
      )}
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full h-10 rounded-lg bg-surface-2 border border-border/80',
            'text-sm text-slate-100 placeholder:text-slate-500',
            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            'disabled:opacity-60 transition',
            icon ? 'pl-10 pr-3' : 'px-3',
            error && 'border-danger focus:border-danger focus:ring-danger/30',
            className,
          )}
          {...props}
        />
      </span>
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
>(({ className, label, ...props }, ref) => (
  <label className="block w-full">
    {label && (
      <span className="block text-xs font-medium text-slate-400 mb-1.5">
        {label}
      </span>
    )}
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg bg-surface-2 border border-border/80 px-3 py-2.5',
        'text-sm text-slate-100 placeholder:text-slate-500',
        'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        'transition resize-none',
        className,
      )}
      {...props}
    />
  </label>
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }
>(({ className, label, children, ...props }, ref) => (
  <label className="block w-full">
    {label && (
      <span className="block text-xs font-medium text-slate-400 mb-1.5">
        {label}
      </span>
    )}
    <select
      ref={ref}
      className={cn(
        'w-full h-10 rounded-lg bg-surface-2 border border-border/80 px-3',
        'text-sm text-slate-100',
        'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        'transition',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  </label>
));
Select.displayName = 'Select';
