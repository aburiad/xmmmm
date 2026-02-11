import { Home, FileText, Eye, Settings } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router';

/**
 * Bottom Navigation Component
 * Mobile-first navigation bar
 * 4 main tabs: ড্যাশবোর্ড, তৈরি করুন, প্রিভিউ, সেটিংস
 */
export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paperId } = useParams();

  const tabs = [
    {
      id: 'home',
      label: 'ড্যাশবোর্ড',
      icon: Home,
      path: '/',
      match: (path) => path === '/',
    },
    {
      id: 'create',
      label: 'তৈরি করুন',
      icon: FileText,
      path: '/setup', // নতুন paper তৈরি করতে setup page এ যাও
      match: (path) => path.includes('/setup') || path.includes('/builder'),
    },
    {
      id: 'preview',
      label: 'প্রিভিউ',
      icon: Eye,
      path: paperId ? `/preview/${paperId}` : '/', // যদি paperId থাকে তাহলে preview, না হলে home
      match: (path) => path.includes('/preview'),
      disabled: !paperId, // কোন paper select না থাকলে disable
    },
    {
      id: 'settings',
      label: 'সেটিংস',
      icon: Settings,
      path: '/settings',
      match: (path) => path.includes('/settings'),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.match(location.pathname);

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              disabled={tab.disabled}
              className={`
                flex flex-col items-center justify-center gap-1 
                flex-1 h-full transition-colors
                active:bg-slate-50
                ${isActive ? 'text-blue-600' : 'text-slate-500'}
                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}
              `}
              aria-label={tab.label}
            >
              <Icon 
                className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} 
              />
              <span className={`text-xs font-['Noto_Sans_Bengali'] ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}