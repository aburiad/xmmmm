import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page
 * পেজ পাওয়া যায়নি - ৪০৪ এরর পেজ
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">😕</div>
          <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
            404
          </CardTitle>
          <p className="text-lg text-slate-700 font-semibold mb-1">
            পেজটি পাওয়া যায়নি
          </p>
          <p className="text-sm text-slate-500">
            আপনি যে পেজটি খুঁজছেন সেটি মুছে ফেলা হয়েছে বা অস্তিত্ব নেই।
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            হোম পেজে ফিরে যান
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            পূর্ববর্তী পেজে ফিরে যান
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
