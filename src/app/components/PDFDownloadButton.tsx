import React, { useState } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { QuestionPaper } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { ensureFontsLoaded, createStyledClone, cleanupElement } from '../utils/fontLoader';

interface PDFDownloadButtonProps {
  paper: QuestionPaper;
  pageSettings: {
    pageWidth: number;
    pageHeight: number;
    pageMargin: number;
  };
  previewRef: React.RefObject<HTMLDivElement>;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ 
  paper, 
  pageSettings,
  previewRef 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!previewRef.current) {
      toast.error('Preview not found');
      return;
    }

    let tempWrapper: HTMLElement | null = null;

    try {
      setIsGenerating(true);
      toast.info('PDF তৈরি হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন');

      console.log('[PDF] Starting font loading...');
      // Wait for all fonts to load
      await ensureFontsLoaded();
      console.log('[PDF] Fonts loaded successfully');

      console.log('[PDF] Creating styled clone...');
      // Create a styled clone with all computed styles applied inline
      // This returns the wrapper element containing the styled clone
      tempWrapper = await createStyledClone(previewRef.current);
      const clone = tempWrapper.firstChild as HTMLElement;
      console.log('[PDF] Clone created with dimensions:', clone.offsetWidth, 'x', clone.offsetHeight);

      console.log('[PDF] Starting canvas capture...');
      // Capture the clone as canvas with high quality settings
      const canvas = await html2canvas(clone, {
        scale: 3, // Higher scale for better quality (3x)
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        imageTimeout: 15000,
        removeContainer: false,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        foreignObjectRendering: false, // Disable for better compatibility
        onclone: (clonedDoc) => {
          // Ensure fonts are available in cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              font-family: 'Noto Sans Bengali', 'Noto Serif Bengali', 'Hind Siliguri', sans-serif !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      });
      console.log('[PDF] Canvas captured:', canvas.width, 'x', canvas.height);
      
      // Clean up temporary wrapper
      cleanupElement(tempWrapper);
      tempWrapper = null;
      console.log('[PDF] Temporary elements cleaned up');

      // Calculate PDF dimensions (A4 in mm: 210 x 297)
      const imgWidth = pageSettings.pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      console.log('[PDF] PDF dimensions:', imgWidth, 'x', imgHeight, 'mm');

      // Create PDF with proper orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Convert canvas to high quality JPEG
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      console.log('[PDF] Image data created, size:', imgData.length, 'bytes');
      
      // Add image to PDF - if content is longer than one page, add multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      const pageHeight = pageSettings.pageHeight;
      let pageCount = 1;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add subsequent pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        pageCount++;
      }
      console.log('[PDF] Created', pageCount, 'page(s)');

      // Generate filename with Bangla support
      const subjectName = paper.setup.subject?.replace(/\s+/g, '_') || 'question-paper';
      const className = paper.setup.class?.replace(/\s+/g, '_') || '';
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `${subjectName}_${className}_${timestamp}.pdf`;
      console.log('[PDF] Saving as:', fileName);

      // Download
      pdf.save(fileName);
      toast.success('PDF সফলভাবে ডাউনলোড হয়েছে!');
      console.log('[PDF] Download complete');
    } catch (error) {
      console.error('[PDF] Generation error:', error);
      toast.error('PDF তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      // Ensure cleanup even if there's an error
      if (tempWrapper) {
        console.log('[PDF] Cleaning up temporary wrapper');
        cleanupElement(tempWrapper);
      }
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      disabled={isGenerating}
      onClick={handleDownload}
      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
    >
      <Download className="w-4 h-4 mr-2" />
      {isGenerating ? 'PDF তৈরি হচ্ছে...' : 'PDF ডাউনলোড করুন'}
    </Button>
  );
};