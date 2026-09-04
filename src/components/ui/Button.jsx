import Spinner from './Spinner.jsx'

const variants = {
  primary:
    'bg-ink-800 text-white hover:bg-ink-900 active:bg-ink-950 disabled:bg-ink-300',
  secondary:
    'bg-ink-50 text-ink-800 hover:bg-ink-100 active:bg-ink-200 disabled:text-ink-300',
  outline:
    'border border-slate-200 bg-white text-ink-800 hover:bg-slate-50 active:bg-slate-100 disabled:text-slate-300',
  ghost: 'text-ink-700 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-300',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300',
}

const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-[15px] gap-2 rounded-xl',
}

export default function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  const isDisabled = disabled || loading
  return (
    <As
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-semibold transition-colors duration-150 disabled:cursor-not-allowed select-none ${
        variants[variant]
      } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Spinner size={size === 'sm' ? 14 : 16} className="text-current" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 18} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 18} />}
    </As>
  )
}
