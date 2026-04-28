import { HTMLAttributes } from 'react';
import { cn } from './cn';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-700/60 text-slate-200',
  primary: 'bg-primary-500/15 text-primary-300 border border-primary-500/30',
  success: 'bg-success/15 text-emerald-300 border border-success/30',
  warning: 'bg-warning/15 text-amber-300 border border-warning/30',
  danger: 'bg-danger/15 text-red-300 border border-danger/30',
  info: 'bg-info/15 text-cyan-300 border border-info/30',
  outline: 'bg-transparent border border-border text-slate-300',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
