import { Plus } from 'lucide-react';

/**
 * Floating Action Button (FAB)
 * প্রাইমারি action এর জন্য floating button
 * 
 * Props:
 * - onClick: Click handler
 * - icon: Icon component (default: Plus)
 * - label: Accessibility label
 * - className: Additional CSS classes
 */
export function FAB({ 
  onClick, 
  icon: Icon = Plus, 
  label = 'Add', 
  className = '' 
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        md:hidden fixed bottom-20 right-4 z-40
        w-14 h-14 rounded-full
        bg-gradient-to-br from-blue-600 to-blue-700
        text-white shadow-lg
        flex items-center justify-center
        active:scale-95 transition-transform
        hover:shadow-xl
        ${className}
      `}
    >
      <Icon className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
}
