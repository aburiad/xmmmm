import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router';

/**
 * Mobile Header Component
 * Sticky header for mobile screens
 * 
 * Props:
 * - title: Header শিরোনাম (required)
 * - showBack: Back button দেখাবে কিনা (default: false)
 * - onBack: Custom back handler (optional)
 * - action: Right side action button (optional)
 */
export function MobileHeader({ 
  title, 
  showBack = false, 
  onBack, 
  action,
  subtitle 
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 safe-area-top">
      <div className="flex items-center justify-between h-14 px-3 gap-2">
        {/* Left: Back Button or Empty Space */}
        <div className="flex-shrink-0">
          {showBack && (
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-lg active:bg-slate-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>

        {/* Center: Title */}
        <div className="flex-1 min-w-0 text-center px-1">
          <h1 className="text-sm font-semibold text-slate-900 font-['Noto_Sans_Bengali'] truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 font-['Noto_Sans_Bengali'] truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Action (flexible width for content) */}
        <div className="flex-shrink-0">
          {action}
        </div>
      </div>
    </header>
  );
}