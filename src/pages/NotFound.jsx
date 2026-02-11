/**
 * =====================================================
 * Not Found Page (404)
 * =====================================================
 * যখন user এমন কোনো URL এ যায় যা exist করে না, তখন এই page দেখায়
 */

import { useNavigate } from 'react-router';
import { Button } from '../app/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * Not Found Component
 * 404 error page যা user কে বলে যে page পাওয়া যায়নি
 */
export default function NotFound() {
  const navigate = useNavigate(); // Navigation এর জন্য hook
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Text */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-bold text-slate-800">পেজ পাওয়া যায়নি</h2>
          <p className="text-slate-600">
            দুঃখিত, আপনি যে পেজটি খুঁজছেন তা খুঁজে পাওয়া যায়নি।
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Go Back Button */}
          <Button
            onClick={() => navigate(-1)} // একধাপ পেছনে যাও
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            পেছনে যান
          </Button>
          
          {/* Go to Dashboard Button */}
          <Button
            onClick={() => navigate('/')} // Dashboard এ যাও
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            হোমপেজে যান
          </Button>
        </div>
      </div>
    </div>
  );
}
