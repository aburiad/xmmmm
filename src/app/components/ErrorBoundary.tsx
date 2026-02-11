import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Home, RefreshCw } from 'lucide-react';

/**
 * Error Boundary Component
 * রাউটার এরর হ্যান্ডলার কম্পোনেন্ট
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে';
  let errorStatus = 'Error';

  if (isRouteErrorResponse(error)) {
    errorStatus = `${error.status}`;
    
    if (error.status === 404) {
      errorMessage = 'পেজটি পাওয়া যায়নি';
    } else if (error.status === 500) {
      errorMessage = 'সার্ভার ত্রুটি';
    } else {
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">⚠️</div>
          <CardTitle className="text-3xl font-bold text-red-600 mb-2">
            {errorStatus}
          </CardTitle>
          <p className="text-lg text-slate-700 font-semibold mb-1">
            {errorMessage}
          </p>
          <p className="text-sm text-slate-500">
            দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
            size="lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            পেজ রিফ্রেশ করুন
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            হোম পেজে ফিরে যান
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
