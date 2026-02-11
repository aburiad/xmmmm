import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import { Button } from '../components/ui/button';
import { ArrowLeft, BookOpen, Settings, Download } from 'lucide-react';
import { QuestionPaper } from '../types';
import { loadPapers } from '../utils/storage';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { BoardStyleLayout } from '../components/BoardStyleLayout';
import { toast } from 'sonner';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';

export default function A4Preview() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [useBoardStyle, setUseBoardStyle] = useState(true); // Default to board style
  const [settingsOpen, setSettingsOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Page settings state
  const [pageWidth, setPageWidth] = useState(210); // mm
  const [pageHeight, setPageHeight] = useState(297); // mm
  const [pageMargin, setPageMargin] = useState(20); // mm
  const [baseFontSize, setBaseFontSize] = useState(16); // px

  // Load paper data
  useEffect(() => {
    if (paperId) {
      const papers = loadPapers();
      const found = papers.find(p => p.id === paperId);
      if (found) {
        setPaper(found);
      } else {
        navigate('/');
      }
    }
  }, [paperId, navigate]);

  // Load page settings from localStorage
  useEffect(() => {
    if (paperId) {
      const savedSettings = localStorage.getItem(`pageSettings_${paperId}`);
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setPageWidth(settings.pageWidth ?? 210);
          setPageHeight(settings.pageHeight ?? 297);
          setPageMargin(settings.pageMargin ?? 20);
          setBaseFontSize(settings.baseFontSize ?? 16);
          setUseBoardStyle(settings.useBoardStyle ?? true);
        } catch (e) {
          console.error('Error loading page settings:', e);
        }
      }
    }
  }, [paperId]);

  // Save page settings to localStorage whenever they change
  useEffect(() => {
    if (paperId && paper) { // Only save after paper is loaded to avoid saving defaults
      const settings = {
        pageWidth,
        pageHeight,
        pageMargin,
        baseFontSize,
        useBoardStyle,
      };
      localStorage.setItem(`pageSettings_${paperId}`, JSON.stringify(settings));
    }
  }, [paperId, paper, pageWidth, pageHeight, pageMargin, baseFontSize, useBoardStyle]);

  const getExamTypeBangla = (type: string) => {
    const map: Record<string, string> = {
      'class-test': 'শ্রেণি পরীক্ষা',
      'half-yearly': 'অর্ধ-বার্ষিক পরীক্ষা',
      'annual': 'বার্ষিক পরীক্ষা',
      'model-test': 'মডেল টেস্ট',
    };
    return map[type] || type;
  };

  // PDF Download using Browser's native print-to-PDF functionality
  // এটি সবচেয়ে নির্ভরযোগ্য কারণ:
  // ✅ Perfect Bangla font rendering
  // ✅ Exact A4 sizing with CSS @page
  // ✅ Multi-page support automatic
  // ✅ Formula/LaTeX render perfectly
  // ✅ No library dependency issues
  const handlePrintToPDF = useReactToPrint({
    contentRef: previewRef,
    documentTitle: paper ? `${paper.setup.subject || 'question-paper'}_${paper.setup.class || ''}_${new Date().getTime()}` : 'question-paper',
    onBeforePrint: () => {
      toast.info('প্রিন্ট ডায়ালগ খুলছে...');
      return Promise.resolve();
    },
    onAfterPrint: () => {
      toast.success('প্রিন্ট সম্পন্ন! "Save as PDF" দিয়ে সংরক্ষণ করুন');
    },
    pageStyle: `
      @page {
        size: ${pageWidth}mm ${pageHeight}mm;
        margin: 0;
      }
      
      @media print {
        body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .a4-page {
          width: ${pageWidth}mm !important;
          min-height: ${pageHeight}mm !important;
          padding: ${pageMargin}mm !important;
          margin: 0 !important;
          box-shadow: none !important;
          page-break-after: always;
        }
        
        /* Hide any UI elements */
        button, .print\\:hidden {
          display: none !important;
        }
      }
    `,
  });

  if (!paper) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/builder/${paperId}`)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">প্রিভিউ</h1>
                  <p className="text-xs text-slate-500">A4 Format Preview</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    পেজ সেটিংস
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>পেজ সেটিংস</SheetTitle>
                    <SheetDescription>
                      পেজের আকার, মার্জিন এবং ফন্ট সাইজ কাস্টমাইজ করুন। সব পরিবর্তন স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।
                    </SheetDescription>
                  </SheetHeader>
                  
                  <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                    <div className="space-y-6 mt-6">
                      {/* Page Width */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>পেজ প্রস্থ (Width)</Label>
                          <span className="text-sm text-slate-600">{pageWidth}mm</span>
                        </div>
                        <Slider
                          value={[pageWidth]}
                          onValueChange={(value) => setPageWidth(value[0])}
                          min={150}
                          max={250}
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={pageWidth}
                          onChange={(e) => setPageWidth(Number(e.target.value))}
                          min={150}
                          max={250}
                          className="w-full"
                        />
                      </div>

                      {/* Page Height */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>পেজ উচ্চতা (Height)</Label>
                          <span className="text-sm text-slate-600">{pageHeight}mm</span>
                        </div>
                        <Slider
                          value={[pageHeight]}
                          onValueChange={(value) => setPageHeight(value[0])}
                          min={200}
                          max={400}
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={pageHeight}
                          onChange={(e) => setPageHeight(Number(e.target.value))}
                          min={200}
                          max={400}
                          className="w-full"
                        />
                      </div>

                      {/* Page Margin */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>পেজ মার্জিন (Margin)</Label>
                          <span className="text-sm text-slate-600">{pageMargin}mm</span>
                        </div>
                        <Slider
                          value={[pageMargin]}
                          onValueChange={(value) => setPageMargin(value[0])}
                          min={5}
                          max={40}
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={pageMargin}
                          onChange={(e) => setPageMargin(Number(e.target.value))}
                          min={5}
                          max={40}
                          className="w-full"
                        />
                      </div>

                      {/* Base Font Size */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>ফন্ট সাইজ (Font Size)</Label>
                          <span className="text-sm text-slate-600">{baseFontSize}px</span>
                        </div>
                        <Slider
                          value={[baseFontSize]}
                          onValueChange={(value) => setBaseFontSize(value[0])}
                          min={10}
                          max={24}
                          step={1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={baseFontSize}
                          onChange={(e) => setBaseFontSize(Number(e.target.value))}
                          min={10}
                          max={24}
                          className="w-full"
                        />
                      </div>

                      {/* Preset Buttons */}
                      <div className="space-y-2 pt-4 border-t">
                        <Label>প্রিসেট</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPageWidth(210);
                              setPageHeight(297);
                              setPageMargin(20);
                              setBaseFontSize(16);
                              toast.success('A4 সেটিংস প্রয়োগ করা হয়েছে');
                            }}
                          >
                            A4 Standard
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPageWidth(215);
                              setPageHeight(279);
                              setPageMargin(25);
                              setBaseFontSize(16);
                              toast.success('Letter সেটিংস প্রয়োগ করা হয়েছে');
                            }}
                          >
                            Letter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPageWidth(210);
                              setPageHeight(297);
                              setPageMargin(15);
                              setBaseFontSize(14);
                              toast.success('Compact সেটিংস প্রয়োগ করা হয়েছে');
                            }}
                          >
                            Compact
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPageWidth(210);
                              setPageHeight(297);
                              setPageMargin(25);
                              setBaseFontSize(18);
                              toast.success('Large সেটিংস প্রয়োগ করা হয়েছে');
                            }}
                          >
                            Large
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintToPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                ডাউনলোড করুন
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* A4 Paper Preview */}
      <div className="max-w-5xl mx-auto p-6">
        {/* A4 Container - Fixed dimensions */}
        <div
          ref={previewRef}
          className="a4-page shadow-lg"
          style={{
            padding: `${pageMargin}mm`,
            fontSize: `${baseFontSize}px`,
          }}
        >
          {useBoardStyle ? (
            <BoardStyleLayout paper={paper} baseFontSize={baseFontSize} />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-slate-800">
                {paper.setup.schoolName && (
                  <h1 className="text-2xl font-bold mb-2 font-['Noto_Sans_Bengali']">
                    {paper.setup.schoolName}
                  </h1>
                )}
                <h2 className="text-xl font-semibold mb-1 font-['Noto_Sans_Bengali']">
                  {getExamTypeBangla(paper.setup.examType)}
                </h2>
                <div className="flex justify-center gap-8 mt-3 text-base">
                  <span className="font-['Noto_Sans_Bengali']">শ্রেণি: {paper.setup.class}</span>
                  <span className="font-['Noto_Sans_Bengali']">বিষয়: {paper.setup.subject}</span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex justify-between mb-6 text-sm pb-4 border-b border-slate-300">
                <div>
                  <span className="font-['Noto_Sans_Bengali']">সময়: {paper.setup.timeMinutes} মিনিট</span>
                </div>
                <div>
                  <span className="font-['Noto_Sans_Bengali']">পূর্ণমান: {paper.setup.totalMarks}</span>
                </div>
              </div>

              {/* Instructions */}
              {paper.setup.instructions && (
                <div className="mb-6 p-4 bg-slate-50 rounded border border-slate-200">
                  <p className="text-sm font-medium mb-2 font-['Noto_Sans_Bengali']">নির্দেশনা:</p>
                  <p className="text-sm font-['Noto_Sans_Bengali']">{paper.setup.instructions}</p>
                </div>
              )}

              {/* Questions with Column Layout */}
              <div 
                className="font-['Noto_Sans_Bengali']"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${parseInt(paper.setup.layout || '1')}, 1fr)`,
                  gap: '1.5rem',
                }}
              >
                {paper.questions.map((question) => (
                  <div key={question.id} className="pb-4 border-b border-slate-200 last:border-b-0">
                    <QuestionRenderer question={question} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Page break indicator */}
      <div className="text-center text-xs text-slate-400 mt-4 mb-8">
        {pageWidth}mm × {pageHeight}mm (Margin: {pageMargin}mm, Font: {baseFontSize}px)
      </div>
    </div>
  );
}