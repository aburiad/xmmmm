/**
 * =====================================================
 * Dashboard Page - মূল হোমপেজ
 * =====================================================
 * এই page এ সব question papers এর list দেখানো হয়
 * User নতুন paper তৈরি, edit, delete, duplicate করতে পারে
 * 
 * Features:
 * - সব question papers দেখায়
 * - নতুন paper তৈরি করা যায়
 * - Existing paper edit/delete/duplicate করা যায়
 * - Paper এর details (subject, class, questions count, marks) দেখায়
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// UI Components
import { Button } from '../app/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../app/components/ui/dropdown-menu';

// Icons
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

// Utils & Components
import { loadPapers, deletePaper, duplicatePaper } from '../utils/storage';
import { getExamTypeBangla } from '../config/constants';
import { toast } from 'sonner';
import { HelpDialog } from '../app/components/HelpDialog';

/**
 * Dashboard Component
 * Main landing page যেখানে সব question papers দেখানো হয়
 */
export default function Dashboard() {
  // ==================== State Management ====================
  
  // papers - সব question papers এর array
  const [papers, setPapers] = useState([]);
  
  // navigate - React Router এর navigation function
  const navigate = useNavigate();

  // ==================== Effects ====================
  
  /**
   * Component mount হলে localStorage থেকে papers load করে
   */
  useEffect(() => {
    setPapers(loadPapers());
  }, []);

  // ==================== Event Handlers ====================
  
  /**
   * Paper delete করার handler
   * @param {string} id - Paper এর unique ID
   */
  const handleDelete = (id) => {
    deletePaper(id); // LocalStorage থেকে delete করো
    setPapers(loadPapers()); // Updated list reload করো
    toast.success('প্রশ্নপত্র মুছে ফেলা হয়েছে');
  };

  /**
   * Paper duplicate করার handler
   * @param {string} id - Paper এর unique ID
   */
  const handleDuplicate = (id) => {
    const newPaper = duplicatePaper(id); // Paper copy করো
    if (newPaper) {
      setPapers(loadPapers()); // Updated list reload করো
      toast.success('প্রশ্নপত্র কপি করা হয়েছে');
    }
  };

  // ==================== Render ====================
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==================== Header Section ==================== */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  বাংলাদেশ বোর্ড প্রশ্নপত্র জেনারেটর
                </h1>
                <p className="text-sm text-slate-500">Question Paper Generator</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Help Dialog */}
              <HelpDialog />
              
              {/* নতুন প্রশ্নপত্র তৈরি Button */}
              <Button 
                onClick={() => navigate('/setup')} // Setup page এ যাও
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                নতুন প্রশ্নপত্র তৈরি করুন
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== Main Content Section ==================== */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* যদি কোনো paper না থাকে, Empty State দেখাও */}
        {papers.length === 0 ? (
          <div className="text-center py-16">
            {/* Empty State Icon */}
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            
            {/* Empty State Text */}
            <h2 className="text-xl font-medium text-slate-700 mb-2">
              কোন প্রশ্নপত্র নেই
            </h2>
            <p className="text-slate-500 mb-6">
              নতুন একটি প্রশ্নপত্র তৈরি করে শুরু করুন
            </p>
            
            {/* Create First Paper Button */}
            <Button 
              onClick={() => navigate('/setup')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              প্রথম প্রশ্নপত্র তৈরি করুন
            </Button>
          </div>
        ) : (
          <>
            {/* ==================== Papers List Header ==================== */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                আপনার প্রশ্নপত্রসমূহ
              </h2>
              <p className="text-sm text-slate-500">
                মোট {papers.length}টি প্রশ্নপত্র
              </p>
            </div>

            {/* ==================== Papers Grid ==================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* প্রতিটি paper এর জন্য একটি card */}
              {papers.map((paper) => (
                <Card 
                  key={paper.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                >
                  {/* ==================== Card Header ==================== */}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      {/* Paper Title & Description */}
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1 group-hover:text-blue-600 transition-colors">
                          {paper.setup.subject} - শ্রেণি {paper.setup.class}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {getExamTypeBangla(paper.setup.examType)}
                        </CardDescription>
                      </div>

                      {/* ==================== Actions Dropdown ==================== */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Preview Action */}
                          <DropdownMenuItem 
                            onClick={() => navigate(`/preview/${paper.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            প্রিভিউ দেখুন
                          </DropdownMenuItem>

                          {/* Edit Setup Action */}
                          <DropdownMenuItem 
                            onClick={() => navigate(`/setup/${paper.id}`)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            সেটআপ এডিট করুন
                          </DropdownMenuItem>

                          {/* Edit Questions Action */}
                          <DropdownMenuItem 
                            onClick={() => navigate(`/builder/${paper.id}`)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            প্রশ্ন সম্পাদনা করুন
                          </DropdownMenuItem>

                          {/* Duplicate Action */}
                          <DropdownMenuItem 
                            onClick={() => handleDuplicate(paper.id)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            কপি করুন
                          </DropdownMenuItem>

                          {/* Delete Action */}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(paper.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            মুছে ফেলুন
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  {/* ==================== Card Content ==================== */}
                  <CardContent 
                    onClick={() => navigate(`/builder/${paper.id}`)} // Click করলে builder page এ যাও
                  >
                    <div className="space-y-3">
                      {/* Badges - Exam Type & Questions Count */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Exam Type Badge */}
                        <Badge variant="secondary" className="text-xs">
                          {getExamTypeBangla(paper.setup.examType)}
                        </Badge>
                        
                        {/* Questions Count Badge */}
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {paper.questions.length} প্রশ্ন
                        </Badge>
                      </div>
                      
                      {/* Time & Marks Info */}
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        {/* Time Duration */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{paper.setup.timeMinutes} মিনিট</span>
                        </div>
                        
                        {/* Total Marks */}
                        <div className="font-medium">
                          মোট নম্বর: {paper.setup.totalMarks}
                        </div>
                      </div>

                      {/* Last Updated Date */}
                      <div className="text-xs text-slate-400 pt-2 border-t">
                        শেষ আপডেট: {new Date(paper.updatedAt).toLocaleDateString('bn-BD')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}