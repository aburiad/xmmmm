import { Outlet } from 'react-router';
import { BottomNav } from '../mobile/BottomNav';
import { useIsMobile } from '../../hooks/useIsMobile';

/**
 * Root Layout Component
 * Mobile/Desktop responsive wrapper
 * 
 * Mobile: Shows BottomNav, adds bottom padding
 * Desktop: Shows content as-is
 */
export function RootLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className={isMobile ? 'pb-16' : ''}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNav />}
    </div>
  );
}