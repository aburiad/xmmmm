import { createBrowserRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import PaperSetup from './pages/PaperSetup';
import QuestionBuilder from './pages/QuestionBuilder';
import A4Preview from './pages/A4Preview';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { RootLayout } from './components/layouts/RootLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'setup/:paperId?',
        element: <PaperSetup />,
      },
      {
        path: 'builder/:paperId',
        element: <QuestionBuilder />,
      },
      {
        path: 'preview/:paperId',
        element: <A4Preview />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
