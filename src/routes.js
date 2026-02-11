/**
 * =====================================================
 * Application Routes Configuration
 * =====================================================
 * এই ফাইলে React Router এর সব routes configure করা হয়েছে
 * 
 * Routes:
 * - / : Dashboard (হোম পেজ)
 * - /setup/:paperId : Paper Setup পেজ
 * - /builder/:paperId : Question Builder পেজ
 * - /preview/:paperId : A4 Preview পেজ
 * - * : Not Found পেজ (যদি কোনো route match না করে)
 */

import { createBrowserRouter } from 'react-router';

// Pages import করা হচ্ছে
import Dashboard from './pages/Dashboard';
import PaperSetup from './pages/PaperSetup';
import QuestionBuilder from './pages/QuestionBuilder';
import A4Preview from './pages/A4Preview';
import NotFound from './pages/NotFound';

/**
 * Router configuration তৈরি করা হচ্ছে
 * createBrowserRouter ব্যবহার করে React Router v6 এর Data mode enable করা হয়েছে
 */
export const router = createBrowserRouter([
  {
    path: '/', // Root path
    Component: Dashboard, // Dashboard page দেখাবে
  },
  {
    path: '/setup/:paperId', // Paper setup করার page (:paperId হলো dynamic parameter)
    Component: PaperSetup,
  },
  {
    path: '/builder/:paperId', // Question তৈরি করার page
    Component: QuestionBuilder,
  },
  {
    path: '/preview/:paperId', // A4 format এ preview দেখার page
    Component: A4Preview,
  },
  {
    path: '*', // যদি কোনো route match না করে, তাহলে Not Found page দেখাবে
    Component: NotFound,
  },
]);
