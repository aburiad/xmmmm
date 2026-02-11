import { Block, Question, QuestionPaper } from '../types';
import { SafeKaTeX } from './SafeKaTeX';

interface BoardStyleLayoutProps {
  paper: QuestionPaper;
  baseFontSize?: number;
}

export function BoardStyleLayout({ paper, baseFontSize = 13 }: BoardStyleLayoutProps) {
  const getExamTypeBangla = (type: string) => {
    const map: Record<string, string> = {
      'class-test': 'শ্রেণি পরীক্ষা',
      'half-yearly': 'অর্ধ-বার্ষিক পরীক্ষা',
      'annual': 'বার্ষিক পরীক্ষা',
      'model-test': 'মডেল টেস্ট',
    };
    return map[type] || type;
  };

  // Get column count from layout (default to 2 if not specified)
  const columnCount = parseInt(paper.setup.layout || '2');
  
  // Split questions into columns
  const splitIntoColumns = (questions: Question[], cols: number) => {
    const columns: Question[][] = Array.from({ length: cols }, () => []);
    questions.forEach((question, idx) => {
      columns[idx % cols].push(question);
    });
    return columns;
  };
  
  const questionColumns = splitIntoColumns(paper.questions, columnCount);

  return (
    <div className="board-exam-paper">
      {/* Header Section - Spans full width above columns */}
      <div className="board-header">
        <div className="text-center mb-4 pb-2 border-b border-black">
          {paper.setup.schoolName && (
            <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              {paper.setup.schoolName}
            </h1>
          )}
          <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
            {getExamTypeBangla(paper.setup.examType)} – {new Date().getFullYear()}
          </h2>
          <div className="flex justify-center gap-6 text-sm mt-1">
            <span style={{ fontFamily: "'Noto Serif Bengali', serif" }}>শ্রেণি: {paper.setup.class}</span>
            <span style={{ fontFamily: "'Noto Serif Bengali', serif" }}>বিষয়: {paper.setup.subject}</span>
          </div>
          <div className="flex justify-between text-sm mt-2 px-4">
            <span style={{ fontFamily: "'Noto Serif Bengali', serif" }}>সময়: {paper.setup.timeMinutes} মিনিট</span>
            <span style={{ fontFamily: "'Noto Serif Bengali', serif" }}>পূর্ণমান: {paper.setup.totalMarks}</span>
          </div>
        </div>

        {/* Instructions (compact, above columns) */}
        <div className="mb-3 text-xs border-b border-gray-300 pb-2" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          <p className="italic">
            {paper.setup.instructions || '[দ্রষ্টব্য: ডান পাশে উল্লেখিত সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। প্রদত্ত উদ্দীপকটি পড়ে ক থেকে ঘ পর্যন্ত ৪টি প্রশ্নের উত্তর দিতে হবে।]'}
          </p>
        </div>
      </div>

      {/* Multi-Column Layout */}
      <div className="board-columns">
        {questionColumns.map((column, idx) => (
          <div key={idx} className="board-column">
            {column.map((question) => (
              <BoardQuestion key={question.id} question={question} />
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .board-exam-paper {
          font-family: 'Noto Serif Bengali', serif;
          font-size: ${baseFontSize}px;
          line-height: 1.4;
          color: #000;
        }

        .board-columns {
          display: grid;
          grid-template-columns: repeat(${columnCount}, 1fr);
          gap: 0;
          min-height: 180mm;
        }

        .board-column {
          padding: 0 8px;
        }

        .board-question {
          margin-bottom: 8px;
          page-break-inside: avoid;
        }

        .board-question-header {
          display: flex;
          align-items: flex-start;
          gap: 4px;
          margin-bottom: 4px;
        }

        .board-question-number {
          font-weight: 600;
          font-size: 14px;
          min-width: 32px;
        }

        .board-question-marks {
          font-size: 13px;
          margin-left: auto;
          min-width: 28px;
          text-align: center;
        }

        .board-question-content {
          margin-left: 0;
          margin-bottom: 3px;
        }

        .board-section-title {
          text-align: center;
          font-weight: 700;
          font-size: 14px;
          margin: 12px 0 8px 0;
          text-decoration: underline;
        }

        .board-uddipok {
          margin: 4px 0 6px 0;
          padding: 4px 6px;
          background-color: rgba(240, 245, 250, 0.5);
          border-left: 2px solid #e0e0e0;
          font-size: 12.5px;
          line-height: 1.4;
        }

        .board-subquestions {
          margin-top: 4px;
          margin-left: 8px;
        }

        .board-subquestion {
          margin-bottom: 4px;
          display: flex;
          gap: 4px;
          align-items: flex-start;
        }

        .board-subquestion-label {
          font-weight: 600;
          min-width: 26px;
          flex-shrink: 0;
        }

        .board-subquestion-content {
          flex: 1;
          line-height: 1.4;
        }

        .board-subquestion-marks {
          font-size: 13px;
          margin-left: auto;
          flex-shrink: 0;
          min-width: 28px;
          text-align: center;
        }

        .board-block {
          margin: 2px 0;
        }

        .board-formula {
          margin: 4px 0;
          font-size: 13px;
        }

        .board-image {
          max-width: 100%;
          height: auto;
          margin: 6px 0;
          border: 1px solid #ddd;
        }

        .board-diagram-placeholder {
          border: 1px dashed #999;
          padding: 8px;
          margin: 6px 0;
          text-align: center;
          font-size: 11px;
          color: #666;
          font-style: italic;
          background-color: #fafafa;
        }

        @media print {
          .board-exam-paper {
            font-size: 12px;
          }
          
          .board-question {
            page-break-inside: avoid;
          }

          .board-uddipok {
            background-color: rgba(240, 245, 250, 0.3);
          }
        }
      `}</style>
    </div>
  );
}

function BoardQuestion({ question }: { question: Question }) {
  const isCreative = question.type === 'creative';

  return (
    <div className={`board-question ${isCreative ? 'creative-question' : ''}`}>
      {/* Question Number and Marks */}
      <div className="board-question-header">
        <span className="board-question-number">{question.number}।</span>
        {!isCreative && <span className="board-question-marks">{question.marks}</span>}
      </div>

      {/* Main Question Content (Uddipok for creative) */}
      {isCreative && question.blocks.length > 0 && (
        <div className="board-uddipok">
          {question.blocks.map((block) => (
            <BoardBlock key={block.id} block={block} />
          ))}
        </div>
      )}

      {/* Non-creative question content */}
      {!isCreative && (
        <div className="board-question-content">
          {question.blocks.map((block) => (
            <BoardBlock key={block.id} block={block} />
          ))}
        </div>
      )}

      {/* Creative Sub-questions */}
      {isCreative && question.subQuestions && question.subQuestions.length > 0 && (
        <div className="board-subquestions">
          {question.subQuestions.map((subQ) => (
            <div key={subQ.id} className="board-subquestion">
              <span className="board-subquestion-label">{subQ.label}.</span>
              <div className="board-subquestion-content">
                {subQ.blocks.map((block) => (
                  <BoardBlock key={block.id} block={block} />
                ))}
              </div>
              <span className="board-subquestion-marks">{subQ.marks}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BoardBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="board-block" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          {block.content.text}
        </div>
      );

    case 'formula':
      if (!block.content.latex) return null;
      return (
        <div className="board-formula">
          <SafeKaTeX math={block.content.latex} />
        </div>
      );

    case 'image':
      if (!block.content.url) return null;
      return (
        <div className="board-block">
          <img 
            src={block.content.url} 
            alt="Question" 
            className="board-image"
          />
        </div>
      );

    case 'diagram':
      return (
        <div className="board-diagram-placeholder">
          [{block.content.description || 'চিত্র'}]
        </div>
      );

    case 'table':
      const rows = block.content.rows || 2;
      const cols = block.content.cols || 2;
      return (
        <div className="board-block">
          <table style={{ 
            borderCollapse: 'collapse', 
            border: '1px solid #000', 
            fontSize: '11px',
            width: '100%'
          }}>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {Array.from({ length: cols }).map((_, colIdx) => (
                    <td
                      key={colIdx}
                      style={{
                        border: '1px solid #000',
                        padding: '4px 6px',
                        textAlign: 'center'
                      }}
                    >
                      {/* Empty cell for student answers */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'list':
      if (!block.content.items || block.content.items.length === 0) return null;
      return (
        <div className="board-block" style={{ marginLeft: '4px' }}>
          {block.content.items.map((item: string, idx: number) => (
            item.trim() && (
              <div key={idx} style={{ 
                fontFamily: "'Noto Serif Bengali', serif",
                marginBottom: '2px',
                lineHeight: '1.4'
              }}>
                {String.fromCharCode(97 + idx)}. {item}
              </div>
            )
          ))}
        </div>
      );

    case 'blank':
      return (
        <div className="board-block" style={{ 
          borderBottom: '1px dotted #999', 
          height: '20px',
          margin: '4px 0' 
        }} />
      );

    default:
      return null;
  }
}