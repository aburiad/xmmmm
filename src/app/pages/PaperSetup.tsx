import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { PaperSetup, QuestionPaper, ExamType, LayoutType } from '../types';
import { loadPapers, savePaper, generateId } from '../utils/storage';
import { toast } from 'sonner';

export default function PaperSetupPage() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [setup, setSetup] = useState<PaperSetup>({
    class: 6,
    subject: 'গণিত',
    examType: 'class-test',
    timeMinutes: 60,
    totalMarks: 100,
    layout: '1',
    schoolName: '',
    date: new Date().toISOString().split('T')[0],
    instructions: '',
  });
  const [customSubject, setCustomSubject] = useState('');

  useEffect(() => {
    if (paperId) {
      const papers = loadPapers();
      const paper = papers.find(p => p.id === paperId);
      if (paper) {
        setSetup(paper.setup);
      }
    }
  }, [paperId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Custom subject check করো
    const finalSubject = setup.subject === 'অন্যান্য' ? customSubject : setup.subject;

    if (!finalSubject.trim()) {
      toast.error('বিষয় লিখুন');
      return;
    }

    // Final setup object তৈরি করো
    const finalSetup = {
      ...setup,
      subject: finalSubject,
    };

    let paper: QuestionPaper;

    if (paperId) {
      const papers = loadPapers();
      const existing = papers.find(p => p.id === paperId);
      if (existing) {
        paper = {
          ...existing,
          setup: finalSetup,
          updatedAt: new Date().toISOString(),
        };
      } else {
        return;
      }
    } else {
      paper = {
        id: generateId(),
        setup: finalSetup,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    savePaper(paper);
    toast.success('সেটআপ সংরক্ষিত হয়েছে');
    navigate(`/builder/${paper.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {paperId ? 'সেটআপ সম্পাদনা করুন' : 'প্রশ্নপত্র সেটআপ'}
                </h1>
                <p className="text-xs text-slate-500">Question Paper Setup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>মৌলিক তথ্য</CardTitle>
              <CardDescription>প্রশ্নপত্রের প্রাথমিক তথ্য প্রদান করুন</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Class */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">শ্রেণি (Class)</Label>
                  <Select
                    value={setup.class.toString()}
                    onValueChange={(value) => setSetup({ ...setup, class: parseInt(value) })}
                  >
                    <SelectTrigger id="class">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[6, 7, 8, 9, 10].map((cls) => (
                        <SelectItem key={cls} value={cls.toString()}>
                          শ্রেণি {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">বিষয় (Subject)</Label>
                  <Select
                    value={setup.subject}
                    onValueChange={(value) => setSetup({ ...setup, subject: value })}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="গণিত">গণিত (Mathematics)</SelectItem>
                      <SelectItem value="উচ্চতর গণিত">উচ্চতর গণিত (Higher Math)</SelectItem>
                      <SelectItem value="বিজ্ঞান">বিজ্ঞান (Science)</SelectItem>
                      <SelectItem value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান (Physics)</SelectItem>
                      <SelectItem value="রসায়ন">রসায়ন (Chemistry)</SelectItem>
                      <SelectItem value="জীববিজ্ঞান">জীববিজ্ঞান (Biology)</SelectItem>
                      <SelectItem value="বাংলা">বাংলা (Bangla)</SelectItem>
                      <SelectItem value="ইংরেজি">ইংরেজি (English)</SelectItem>
                      <SelectItem value="অন্যান্য">অন্যান্য (Other)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Subject Input (shown when "অন্যান্য" selected) */}
              {setup.subject === 'অন্যান্য' && (
                <div className="space-y-2">
                  <Label htmlFor="customSubject">বিষয়ের নাম লিখুন *</Label>
                  <Input
                    id="customSubject"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="যেমন: বীজগণিত, জ্যামিতি, ত্রিকোণমিতি"
                    required
                  />
                </div>
              )}

              {/* Exam Type */}
              <div className="space-y-2">
                <Label htmlFor="examType">পরীক্ষার ধরন (Exam Type)</Label>
                <Select
                  value={setup.examType}
                  onValueChange={(value) => setSetup({ ...setup, examType: value as ExamType })}
                >
                  <SelectTrigger id="examType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class-test">শ্রেণি পরীক্ষা (Class Test)</SelectItem>
                    <SelectItem value="half-yearly">অর্ধ-বার্ষিক (Half Yearly)</SelectItem>
                    <SelectItem value="annual">বার্ষিক (Annual)</SelectItem>
                    <SelectItem value="model-test">মডেল টেস্ট (Model Test)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time and Marks */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">সময় (মিনিট)</Label>
                  <Input
                    id="time"
                    type="number"
                    min="15"
                    max="300"
                    value={setup.timeMinutes}
                    onChange={(e) => setSetup({ ...setup, timeMinutes: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marks">মোট নম্বর</Label>
                  <Input
                    id="marks"
                    type="number"
                    min="10"
                    max="200"
                    value={setup.totalMarks}
                    onChange={(e) => setSetup({ ...setup, totalMarks: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Layout */}
              <div className="space-y-2">
                <Label htmlFor="layout">লেআউট (Layout)</Label>
                <Select
                  value={setup.layout}
                  onValueChange={(value) => setSetup({ ...setup, layout: value as LayoutType })}
                >
                  <SelectTrigger id="layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">১ কলাম (1 Column)</SelectItem>
                    <SelectItem value="2">২ কলাম (2 Columns)</SelectItem>
                    <SelectItem value="3">৩ কলাম (3 Columns)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* School Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-slate-900">অতিরিক্ত তথ্য (Optional)</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="schoolName">প্রতিষ্ঠানের নাম</Label>
                  <Input
                    id="schoolName"
                    value={setup.schoolName || ''}
                    onChange={(e) => setSetup({ ...setup, schoolName: e.target.value })}
                    placeholder="যেমন: ঢাকা সরকারি উচ্চ বিদ্যালয়"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">তারিখ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={setup.date || ''}
                    onChange={(e) => setSetup({ ...setup, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">দ্রষ্টব্য / নির্দেশনা (Instructions)</Label>
                  <Textarea
                    id="instructions"
                    value={setup.instructions || ''}
                    onChange={(e) => setSetup({ ...setup, instructions: e.target.value })}
                    placeholder="যেমন: ডান পাশে উল্লেখিত সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। প্রদত্ত উদ্দীপকটি পড়ে ক থেকে ঘ পর্যন্ত ৪টি প্রশ্নের উত্তর দিতে হবে।"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              বাতিল করুন
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {paperId ? 'সংরক্ষণ করুন' : 'প্রশ্ন যোগ করতে এগিয়ে যান'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}