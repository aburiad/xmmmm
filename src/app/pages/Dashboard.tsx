import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  BookOpen,
  Plus,
  FileText,
  MoreVertical,
  Eye,
  Pencil,
  Copy,
  Trash2,
  GraduationCap,
  Clock,
  Settings,
} from 'lucide-react';
import { QuestionPaper } from '../types';
import { loadPapers, deletePaper, duplicatePaper } from '../utils/storage';
import { toast } from 'sonner';
import { HelpDialog } from '../components/HelpDialog';
import { useIsMobile } from '../hooks/useIsMobile';
import { MobileHeader } from '../components/mobile/MobileHeader';
import { FAB } from '../components/mobile/FAB';
import { MobileCard, MobileCardHeader, MobileCardContent, MobileCardFooter } from '../components/mobile/MobileCard';

export default function Dashboard() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    setPapers(loadPapers());
  }, []);

  const handleDelete = (id: string) => {
    deletePaper(id);
    setPapers(loadPapers());
    toast.success('Question paper deleted');
  };

  const handleDuplicate = (id: string) => {
    const newPaper = duplicatePaper(id);
    if (newPaper) {
      setPapers(loadPapers());
      toast.success('Question paper duplicated');
    }
  };

  const getExamTypeBangla = (type: string) => {
    const map: Record<string, string> = {
      'class-test': 'শ্রেণি পরীক্ষা',
      'half-yearly': 'অর্ধ-বার্ষিক',
      'annual': 'বার্ষিক',
      'model-test': 'মডেল টেস্ট',
    };
    return map[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-safe">
      {/* Desktop Header - Hidden on Mobile */}
      {!isMobile && (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">বাংলাদেশ বোর্ড প্রশ্নপত্র জেনারেটর</h1>
                  <p className="text-sm text-slate-500">Question Paper Generator</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HelpDialog />
                <Button 
                  onClick={() => navigate('/setup')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  নতুন প্রশ্নপত্র তৈরি করুন
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader
          title="প্রশ্নপত্র জেনারেটর"
          subtitle="Question Paper Generator"
          action={<HelpDialog />}
        />
      )}

      {/* Main Content - Same for both Mobile and Desktop */}
      <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-8'}`}>
        {papers.length === 0 ? (
          <div className={`text-center ${isMobile ? 'py-12' : 'py-16'}`}>
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-medium text-slate-700 mb-2 font-['Noto_Sans_Bengali']">কোন প্রশ্নপত্র নেই</h2>
            <p className="text-slate-500 mb-6 font-['Noto_Sans_Bengali']">নতুন একটি প্রশ্নপত্র তৈরি করে শুরু করুন</p>
            {!isMobile && (
              <Button 
                onClick={() => navigate('/setup')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                প্রথম প্রশ্নপত্র তৈরি করুন
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className={`font-semibold text-slate-900 font-['Noto_Sans_Bengali'] ${isMobile ? 'text-base' : 'text-lg'}`}>
                আপনার প্রশ্নপত্রসমূহ
              </h2>
              <p className="text-sm text-slate-500 font-['Noto_Sans_Bengali']">মোট {papers.length}টি প্রশ্নপত্র</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((paper) => {
                const CardComponent = isMobile ? MobileCard : Card;
                
                return (
                  <CardComponent key={paper.id} className="hover:shadow-md transition-shadow group">
                    <CardHeader className={`pb-3 ${isMobile ? 'p-4' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => navigate(`/builder/${paper.id}`)}
                        >
                          <CardTitle className={`mb-1 group-hover:text-blue-600 transition-colors font-['Noto_Sans_Bengali'] ${isMobile ? 'text-base' : 'text-base'}`}>
                            {paper.setup.subject} - শ্রেণি {paper.setup.class}
                          </CardTitle>
                          <CardDescription className="text-sm font-['Noto_Sans_Bengali']">
                            {getExamTypeBangla(paper.setup.examType)}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className={`p-0 ${isMobile ? 'h-10 w-10' : 'h-8 w-8'}`}>
                              <MoreVertical className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/preview/${paper.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              <span className="font-['Noto_Sans_Bengali']">প্রিভিউ দেখুন</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/setup/${paper.id}`)}>
                              <Settings className="w-4 h-4 mr-2" />
                              <span className="font-['Noto_Sans_Bengali']">সেটআপ এডিট করুন</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/builder/${paper.id}`)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              <span className="font-['Noto_Sans_Bengali']">প্রশ্ন সম্পাদনা করুন</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(paper.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              <span className="font-['Noto_Sans_Bengali']">কপি করুন</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(paper.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span className="font-['Noto_Sans_Bengali']">মুছে ফেলুন</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent 
                      className={`cursor-pointer ${isMobile ? 'p-4 pt-0' : ''}`}
                      onClick={() => navigate(`/builder/${paper.id}`)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs font-['Noto_Sans_Bengali']">
                            {getExamTypeBangla(paper.setup.examType)}
                          </Badge>
                          <Badge variant="outline" className="text-xs font-['Noto_Sans_Bengali']">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {paper.questions.length} প্রশ্ন
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-600 font-['Noto_Sans_Bengali']">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{paper.setup.timeMinutes} মিনিট</span>
                          </div>
                          <div className="font-medium">
                            মোট নম্বর: {paper.setup.totalMarks}
                          </div>
                        </div>

                        <div className="text-xs text-slate-400 pt-2 border-t">
                          শেষ আপডেট: {new Date(paper.updatedAt).toLocaleDateString('bn-BD')}
                        </div>
                      </div>
                    </CardContent>
                  </CardComponent>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button - Mobile Only */}
      {isMobile && (
        <FAB 
          onClick={() => navigate('/setup')}
          label="নতুন প্রশ্নপত্র তৈরি করুন"
        />
      )}
    </div>
  );
}