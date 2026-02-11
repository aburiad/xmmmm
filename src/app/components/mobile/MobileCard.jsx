/**
 * Mobile Card Component
 * Large touch-friendly card for mobile UI
 * 
 * Props:
 * - children: Card content
 * - onClick: Click handler (makes card pressable)
 * - className: Additional CSS classes
 */
export function MobileCard({ children, onClick, className = '' }) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-slate-200
        ${isClickable ? 'active:bg-slate-50 cursor-pointer' : ''}
        transition-colors
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Mobile Card Header
 */
export function MobileCardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between p-4 border-b border-slate-100">
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-slate-900 font-['Noto_Sans_Bengali'] truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-slate-500 font-['Noto_Sans_Bengali'] mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="ml-3">{action}</div>}
    </div>
  );
}

/**
 * Mobile Card Content
 */
export function MobileCardContent({ children, className = '' }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Mobile Card Footer
 */
export function MobileCardFooter({ children, className = '' }) {
  return (
    <div className={`p-4 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  );
}
