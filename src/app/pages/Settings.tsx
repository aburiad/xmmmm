import { ArrowLeft, Database, FileText, Trash2, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { getAllPapers, clearAllPapers } from '../utils/storage';
import { toast } from 'sonner';
import { useIsMobile } from '../hooks/useIsMobile';

/**
 * Settings Page
 * অ্যাপ্লিকেশন সেটিংস এবং ডেটা ম্যানেজমেন্ট
 */
export default function Settings() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const papers = getAllPapers();

  // সব data clear করার function
  const handleClearAll = () => {
    if (window.confirm('সব ডেটা মুছে ফেলবেন? এটি undo করা যাবে না।')) {
      clearAllPapers();
      toast.success('সব ডেটা মুছে ফেলা হয়েছে');
      navigate('/');
    }
  };

  // Data export করার function
  const handleExport = () => {
    const data = {
      papers: getAllPapers(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-papers-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('ডেটা export হয়েছে');
  };

  // Data import করার function
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.papers && Array.isArray(data.papers)) {
          // Merge with existing data
          const existing = getAllPapers();
          const merged = [...existing, ...data.papers];
          localStorage.setItem('question-papers', JSON.stringify(merged));
          toast.success('ডেটা import হয়েছে');
          window.location.reload();
        }
      } catch (error) {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className={`bg-white border-b border-slate-200 ${isMobile ? 'sticky top-0 z-40' : ''}`}>
        <div className={`flex items-center gap-3 ${isMobile ? 'px-4 py-3' : 'max-w-7xl mx-auto px-6 py-4'}`}>
          <Button 
            variant="ghost" 
            size={isMobile ? 'sm' : 'default'}
            onClick={() => navigate('/')}
          >
            <ArrowLeft className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
          </Button>
          <div>
            <h1 className={`font-semibold font-['Noto_Sans_Bengali'] ${isMobile ? 'text-lg' : 'text-xl'}`}>
              সেটিংস
            </h1>
            <p className={`text-slate-600 font-['Noto_Sans_Bengali'] ${isMobile ? 'text-xs' : 'text-sm'}`}>
              অ্যাপ্লিকেশন সেটিংস এবং ডেটা ম্যানেজমেন্ট
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={isMobile ? 'p-4 space-y-4' : 'max-w-4xl mx-auto px-6 py-8 space-y-6'}>
        {/* Data Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-['Noto_Sans_Bengali']">
              <Database className="w-5 h-5" />
              ডেটা স্টোরেজ
            </CardTitle>
            <CardDescription className="font-['Noto_Sans_Bengali']">
              আপনার ডিভাইসে সংরক্ষিত ডেটা
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium font-['Noto_Sans_Bengali']">মোট প্রশ্নপত্র</p>
                  <p className="text-sm text-slate-600">{papers.length} টি প্রশ্নপত্র সংরক্ষিত</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="font-['Noto_Sans_Bengali']">ডেটা ম্যানেজমেন্ট</CardTitle>
            <CardDescription className="font-['Noto_Sans_Bengali']">
              আপনার ডেটা export, import বা delete করুন
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Export Data */}
            <Button
              variant="outline"
              className="w-full justify-start font-['Noto_Sans_Bengali']"
              onClick={handleExport}
              disabled={papers.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              ডেটা Export করুন (JSON)
            </Button>

            {/* Import Data */}
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button
                  variant="outline"
                  className="w-full justify-start font-['Noto_Sans_Bengali']"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    ডেটা Import করুন
                  </span>
                </Button>
              </label>
            </div>

            {/* Clear All Data */}
            <Button
              variant="destructive"
              className="w-full justify-start font-['Noto_Sans_Bengali']"
              onClick={handleClearAll}
              disabled={papers.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              সব ডেটা মুছে ফেলুন
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-['Noto_Sans_Bengali']">অ্যাপ্লিকেশন তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 font-['Noto_Sans_Bengali']">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-['Noto_Sans_Bengali']">Developer</span>
              <span className="font-medium">Bangladesh Education Board</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-['Noto_Sans_Bengali']">Last Updated</span>
              <span className="font-medium">February 2026</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
