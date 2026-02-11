import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { QuestionPaper } from '../types';

// Register Bengali Font
Font.register({
  family: 'NotoSansBengali',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansbengali/v20/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolKudCk8izI0lc.ttf',
    },
  ],
});

// Ultra-simplified styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansBengali',
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  text: {
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 12,
    marginBottom: 8,
  },
});

interface PDFDocumentProps {
  paper: QuestionPaper;
  pageSettings?: {
    pageWidth?: number;
    pageHeight?: number;
    pageMargin?: number;
  };
}

// Helper function
const getExamTypeBangla = (type: string): string => {
  const map: Record<string, string> = {
    'class-test': 'শ্রেণি পরীক্ষা',
    'half-yearly': 'অর্ধ-বার্ষিক পরীক্ষা',
    'annual': 'বার্ষিক পরীক্ষা',
    'model-test': 'মডেল টেস্ট',
  };
  return map[type] || type;
};

// Safe text renderer - ensures we never pass null/undefined
const safeText = (value: any): string => {
  if (value === null || value === undefined) return ' ';
  if (typeof value === 'string') return value.trim() || ' ';
  return String(value);
};

// Main PDF Document Component - ULTRA MINIMAL
export const QuestionPaperPDF: React.FC<PDFDocumentProps> = ({ paper, pageSettings }) => {
  // Validate paper object
  if (!paper || !paper.setup || !paper.questions) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Invalid data</Text>
        </Page>
      </Document>
    );
  }

  const margin = pageSettings?.pageMargin || 40;

  return (
    <Document>
      <Page size="A4" style={{ ...styles.page, padding: margin }}>
        {/* Header */}
        <View style={styles.section}>
          {paper.setup.schoolName && (
            <Text style={styles.title}>
              {safeText(paper.setup.schoolName)}
            </Text>
          )}
          
          <Text style={styles.subtitle}>
            {safeText(getExamTypeBangla(paper.setup.examType))}
          </Text>
          
          <Text style={styles.text}>
            বিষয়: {safeText(paper.setup.subject)}
          </Text>
          
          <Text style={styles.text}>
            শ্রেণি: {safeText(paper.setup.class)}
          </Text>
          
          <Text style={styles.text}>
            পূর্ণমান: {safeText(paper.setup.totalMarks)}
          </Text>
          
          <Text style={styles.text}>
            সময়: {safeText(paper.setup.duration || `${paper.setup.timeMinutes} মিনিট`)}
          </Text>
        </View>

        {/* Questions - ULTRA SIMPLE */}
        <View style={styles.section}>
          {paper.questions && paper.questions.map((question, idx) => {
            if (!question) return null;
            
            return (
              <View key={question.id || `q-${idx}`} style={styles.section}>
                <Text style={styles.questionText}>
                  {safeText(question.number || idx + 1)}. প্রশ্ন
                </Text>
                
                {question.blocks && question.blocks.map((block, blockIdx) => {
                  if (!block || !block.type) return null;
                  
                  if (block.type === 'text' && block.content?.text) {
                    return (
                      <Text key={blockIdx} style={styles.text}>
                        {safeText(block.content.text)}
                      </Text>
                    );
                  }
                  
                  if (block.type === 'formula' && block.content?.latex) {
                    return (
                      <Text key={blockIdx} style={styles.text}>
                        {safeText(block.content.latex)}
                      </Text>
                    );
                  }
                  
                  return null;
                })}
                
                {question.marks && (
                  <Text style={styles.text}>
                    [{safeText(question.marks)} নম্বর]
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
