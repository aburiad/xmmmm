import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Plus,
  Trash2,
  Save,
  FileText,
  Copy,
} from 'lucide-react';
import { Question, QuestionPaper, QuestionType, SubQuestion } from '../types';
import { loadPapers, savePaper, generateId } from '../utils/storage';
import { BlockEditor } from '../components/BlockEditor';
import { toast } from 'sonner';
import { ScrollArea } from '../components/ui/scroll-area';
import { HelpDialog } from '../components/HelpDialog';
import { useIsMobile } from '../hooks/useIsMobile';
import { MobileHeader } from '../components/mobile/MobileHeader';

const QUESTION_TYPES: { value: QuestionType; label: string; labelEn: string }[] = [
  { value: 'mcq', label: 'বহুনির্বাচনী', labelEn: 'MCQ' },
  { value: 'creative', label: 'সৃজনশীল', labelEn: 'Creative' },
  { value: 'short-question', label: 'সংক্ষিপ্ত প্রশ্ন', labelEn: 'Short Question' },
  { value: 'fill-in-blanks', label: 'শূন্যস্থান পূরণ', labelEn: 'Fill in Blanks' },
  { value: 'true-false', label: 'সত্য/মিথ্যা', labelEn: 'True/False' },
  { value: 'matching', label: 'মিলকরণ', labelEn: 'Matching' },
  { value: 'explain', label: 'ব্যাখ্যা', labelEn: 'Explain' },
  { value: 'problem-solving', label: 'সমস্যা সমাধান', labelEn: 'Problem Solving' },
  { value: 'conversion', label: 'রূপান্তর', labelEn: 'Conversion' },
  { value: 'pattern', label: 'প্যাটার্ন', labelEn: 'Pattern' },
  { value: 'diagram', label: 'চিত্র ভিত্তিক', labelEn: 'Diagram Based' },
  { value: 'construction', label: 'অঙ্কন', labelEn: 'Construction' },
  { value: 'table-based', label: 'টেবিল ভিত্তিক', labelEn: 'Table Based' },
  { value: 'graph-based', label: 'গ্রাফ ভিত্তিক', labelEn: 'Graph Based' },
  { value: 'proof', label: 'প্রমাণ', labelEn: 'Proof' },
];

export default function QuestionBuilder() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const isMobile = useIsMobile();

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

  const createNewQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      type: 'short-question',
      number: (paper?.questions.length || 0) + 1,
      blocks: [],
      marks: 5,
      optional: false,
    };
    setSelectedQuestion(newQuestion);
    setEditingIndex(-1);
  };

  const saveQuestion = () => {
    if (!paper || !selectedQuestion) return;

    if (selectedQuestion.blocks.length === 0) {
      toast.error('ন্তত একটি ব্লক যোগ করুন');
      return;
    }

    let updatedQuestions = [...paper.questions];

    if (editingIndex >= 0) {
      updatedQuestions[editingIndex] = selectedQuestion;
      toast.success('প্রশ্ন আপডেট হয়েছে');
    } else {
      updatedQuestions.push(selectedQuestion);
      toast.success('প্রশ্ন যোগ হয়েছে');
    }

    // Renumber questions
    updatedQuestions = updatedQuestions.map((q, idx) => ({ ...q, number: idx + 1 }));

    const updatedPaper = {
      ...paper,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };

    savePaper(updatedPaper);
    setPaper(updatedPaper);
    setSelectedQuestion(null);
    setEditingIndex(-1);
  };

  const editQuestion = (index: number) => {
    setSelectedQuestion({ ...paper!.questions[index] });
    setEditingIndex(index);
  };

  const deleteQuestion = (index: number) => {
    if (!paper) return;

    const updatedQuestions = paper.questions
      .filter((_, idx) => idx !== index)
      .map((q, idx) => ({ ...q, number: idx + 1 }));

    const updatedPaper = {
      ...paper,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };

    savePaper(updatedPaper);
    setPaper(updatedPaper);
    toast.success('প্রশ্ন মুছে ফেলা হয়েছে');
  };

  const duplicateQuestion = (index: number) => {
    if (!paper) return;

    const originalQuestion = paper.questions[index];
    
    // Create a deep copy with new IDs
    const duplicatedQuestion: Question = {
      ...originalQuestion,
      id: generateId(),
      number: paper.questions.length + 1,
      subQuestions: originalQuestion.subQuestions?.map(subQ => ({
        ...subQ,
        id: generateId(),
      })),
    };

    const updatedQuestions = [...paper.questions, duplicatedQuestion].map((q, idx) => ({
      ...q,
      number: idx + 1,
    }));

    const updatedPaper = {
      ...paper,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };

    savePaper(updatedPaper);
    setPaper(updatedPaper);
    toast.success('প্রশ্ন কপি করা হয়েছে');
  };

  const addSubQuestion = () => {
    if (!selectedQuestion) return;

    const labels = ['ক', 'খ', 'গ', 'ঘ'];
    const currentCount = selectedQuestion.subQuestions?.length || 0;

    if (currentCount >= 4) {
      toast.error('সর্বোচ্চ ৪টি উপপ্রশ্ন যোগ করা যাবে');
      return;
    }

    const newSubQuestion: SubQuestion = {
      id: generateId(),
      label: labels[currentCount],
      blocks: [],
      marks: 2,
    };

    setSelectedQuestion({
      ...selectedQuestion,
      subQuestions: [...(selectedQuestion.subQuestions || []), newSubQuestion],
    });
  };

  const updateSubQuestion = (index: number, subQuestion: SubQuestion) => {
    if (!selectedQuestion) return;

    const updatedSubQuestions = [...(selectedQuestion.subQuestions || [])];
    updatedSubQuestions[index] = subQuestion;

    setSelectedQuestion({
      ...selectedQuestion,
      subQuestions: updatedSubQuestions,
    });
  };

  const deleteSubQuestion = (index: number) => {
    if (!selectedQuestion) return;

    const updatedSubQuestions = (selectedQuestion.subQuestions || []).filter((_, idx) => idx !== index);

    setSelectedQuestion({
      ...selectedQuestion,
      subQuestions: updatedSubQuestions,
    });
  };

  if (!paper) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      {isMobile ? (
        <MobileHeader
          title={`${paper.setup.subject} - শ্রেণি ${paper.setup.class}`}
          subtitle={paper.setup.chapter}
          showBack={true}
          onBack={() => navigate('/')}
          action={
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/preview/${paperId}`)}
              className="h-10 w-10 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
          }
        />
      ) : (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
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
                      {paper.setup.subject} - শ্রেণি {paper.setup.class}
                    </h1>
                    <p className="text-xs text-slate-500">{paper.setup.chapter}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {paper.questions.length} প্রশ্ন
                </Badge>
                <Button variant="outline" onClick={() => navigate(`/preview/${paperId}`)}>
                  <Eye className="w-4 h-4 mr-2" />
                  প্রিভিউ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Question List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-sm md:text-base">প্রশ্ন তালিকা</CardTitle>
                <CardDescription className="text-xs md:text-sm">সর্বমোট {paper.questions.length}টি প্রশ্ন</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {paper.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          editingIndex === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => editQuestion(index)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">প্রশ্ন {question.number}</span>
                              <Badge variant="outline" className="text-xs">
                                {QUESTION_TYPES.find(t => t.value === question.type)?.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500">
                              {question.marks} নম্বর
                              {question.optional && ' • ঐচ্ছিক'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateQuestion(index);
                              }}
                            >
                              <Copy className="w-4 h-4 md:w-3.5 md:h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteQuestion(index);
                              }}
                            >
                              <Trash2 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  onClick={createNewQuestion}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  disabled={selectedQuestion !== null}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  নতুন প্রশ্ন যোগ করুন
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Question Editor */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {editingIndex >= 0 ? `প্রশ্ন ${selectedQuestion.number} সম্পাদনা` : 'নতুন প্রশ্ন'}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedQuestion(null);
                        setEditingIndex(-1);
                      }}
                    >
                      বাতিল
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {/* Question Type */}
                      <div className="space-y-2">
                        <Label>প্রশ্নের ধরন</Label>
                        <Select
                          value={selectedQuestion.type}
                          onValueChange={(value) =>
                            setSelectedQuestion({ ...selectedQuestion, type: value as QuestionType })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {QUESTION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label} ({type.labelEn})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Marks and Optional */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>নম্বর</Label>
                          <Input
                            type="number"
                            min="1"
                            max="50"
                            value={selectedQuestion.marks}
                            onChange={(e) =>
                              setSelectedQuestion({
                                ...selectedQuestion,
                                marks: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>ঐচ্ছিক প্রশ্ন</Label>
                          <div className="flex items-center h-10">
                            <Switch
                              checked={selectedQuestion.optional}
                              onCheckedChange={(checked) =>
                                setSelectedQuestion({ ...selectedQuestion, optional: checked })
                              }
                            />
                            <span className="ml-2 text-sm text-slate-600">
                              {selectedQuestion.optional ? 'হ্যাঁ' : 'না'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Creative Question Sub-parts */}
                      {selectedQuestion.type === 'creative' && (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">সৃজনশীল উপপ্রশ্ন</h3>
                            <Button size="sm" variant="outline" onClick={addSubQuestion}>
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              উপপ্রশ্ন যোগ করুন
                            </Button>
                          </div>

                          {selectedQuestion.subQuestions?.map((subQ, idx) => (
                            <div key={subQ.id} className="p-3 bg-white rounded border border-blue-200">
                              <div className="flex items-center justify-between mb-3">
                                <Badge>{subQ.label}</Badge>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={subQ.marks}
                                    onChange={(e) =>
                                      updateSubQuestion(idx, {
                                        ...subQ,
                                        marks: parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="w-20 h-8"
                                    placeholder="নম্বর"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600"
                                    onClick={() => deleteSubQuestion(idx)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>

                              <BlockEditor
                                blocks={subQ.blocks}
                                onChange={(blocks) => updateSubQuestion(idx, { ...subQ, blocks })}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Main Question Blocks */}
                      <div className="space-y-2">
                        <Label>
                          {selectedQuestion.type === 'creative' ? 'প্রশ্নের উদ্দীপক/স্টেম' : 'প্রশ্নের বিষয়বস্তু'}
                        </Label>
                        <BlockEditor
                          blocks={selectedQuestion.blocks}
                          onChange={(blocks) => setSelectedQuestion({ ...selectedQuestion, blocks })}
                        />
                      </div>

                      {/* Save Button */}
                      <div className="pt-4 border-t">
                        <Button onClick={saveQuestion} className="w-full bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4 mr-2" />
                          প্রশ্ন সংরক্ষণ করুন
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">একটি প্রশ্ন নির্বাচন করুন বা নতুন যোগ করুন</p>
                  <Button onClick={createNewQuestion} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    প্রথম প্রশ্ন যোগ করুন
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}