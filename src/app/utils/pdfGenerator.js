/**
 * WordPress PDF Generator API Integration
 * Generates PDF from question paper data using WordPress backend
 */

const WORDPRESS_API_URL = 'https://ahsan.ronybormon.com/wp-json/qpm/v1';

/**
 * Convert question paper data to WordPress API format
 */
function convertToWordPressFormat(paper, pageSettings) {
  return {
    title: `${paper.setup.subject || 'question-paper'}_${paper.setup.class || ''}_${Date.now()}`,
    questionPaper: {
      header: {
        boardName: paper.setup.boardName || 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড',
        examTitle: paper.setup.examType ? getExamTypeBangla(paper.setup.examType) : '',
        class: paper.setup.class || '',
        subject: paper.setup.subject || '',
        totalMarks: paper.setup.totalMarks || '',
        duration: paper.setup.duration || '',
        logo: paper.setup.boardLogo || ''
      },
      questions: paper.questions.map(q => ({
        number: q.number,
        marks: q.marks || '',
        blocks: q.blocks || [],
        subQuestions: q.subQuestions || []
      }))
    },
    pageSettings: {
      columns: pageSettings.columns || 1,
      columnGap: pageSettings.columnGap || 20,
      marginLeft: pageSettings.pageMargin || 20,
      marginRight: pageSettings.pageMargin || 20,
      marginTop: pageSettings.pageMargin || 20,
      marginBottom: pageSettings.pageMargin || 20
    }
  };
}

/**
 * Get exam type in Bangla
 */
function getExamTypeBangla(type) {
  const map = {
    'class-test': 'শ্রেণি পরীক্ষা',
    'half-yearly': 'অর্ধ-বার্ষিক পরীক্ষা',
    'annual': 'বার্ষিক পরীক্ষা',
    'model-test': 'মডেল টেস্ট',
  };
  return map[type] || type;
}

/**
 * Generate PDF using WordPress backend
 */
export async function generatePDFFromWordPress(paper, pageSettings) {
  try {
    // Convert data to WordPress format
    const payload = convertToWordPressFormat(paper, pageSettings);
    
    // Call WordPress API
    const response = await fetch(`${WORDPRESS_API_URL}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'PDF generation failed');
    }
    
    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        pdfUrl: result.pdf_url,
        filePath: result.file_path
      };
    } else {
      throw new Error(result.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Download PDF file
 */
export function downloadPDF(pdfUrl, filename) {
  // Trigger automatic download
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = filename || 'question-paper.pdf';
  link.target = '_blank'; // Fallback: open in new tab if download fails
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Save question paper to WordPress
 */
export async function saveQuestionPaper(paper, pageSettings) {
  try {
    const payload = convertToWordPressFormat(paper, pageSettings);
    
    const response = await fetch(`${WORDPRESS_API_URL}/papers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save question paper');
    }
    
    const result = await response.json();
    
    return {
      success: result.success,
      postId: result.post_id
    };
    
  } catch (error) {
    console.error('Save Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all saved papers from WordPress
 */
export async function getSavedPapers() {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/papers`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch papers');
    }
    
    const result = await response.json();
    
    return {
      success: result.success,
      papers: result.papers || []
    };
    
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      success: false,
      error: error.message,
      papers: []
    };
  }
}