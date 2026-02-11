/**
 * =====================================================
 * Main App Component
 * =====================================================
 * এটি application এর main entry component
 * এখানে React Router setup করা হয়েছে এবং Toaster (notification) add করা হয়েছে
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './app/components/ui/sonner';

/**
 * Main App Component
 * - RouterProvider: সব routes manage করে
 * - Toaster: Success/Error notifications দেখায়
 */
export default function App() {
  return (
    <>
      {/* Router Provider - সব routes এখানে render হবে */}
      <RouterProvider router={router} />
      
      {/* Toaster - Notification messages দেখানোর জন্য */}
      <Toaster />
    </>
  );
}
