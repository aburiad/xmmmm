import { Block, Question, SubQuestion } from '../types';
import { BlockMath, InlineMath } from 'react-katex';
import { SafeKaTeX } from './SafeKaTeX';

interface QuestionRendererProps {
  question: Question;
  showAnswerSpace?: boolean;
}

export function QuestionRenderer({ question, showAnswerSpace = true }: QuestionRendererProps) {
  return (
    <div className="question-block space-y-3">
      {/* Question Number and Type */}
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-base">{question.number}।</span>
        {question.optional && (
          <span className="text-xs text-slate-500">(ঐচ্ছিক)</span>
        )}
        <span className="ml-auto text-sm text-slate-600">[{question.marks}]</span>
      </div>

      {/* Main Question Content */}
      <div className="ml-6 space-y-2">
        {question.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {/* Creative Sub-questions */}
      {question.type === 'creative' && question.subQuestions && (
        <div className="ml-6 mt-4 space-y-4">
          {question.subQuestions.map((subQ, idx) => (
            <div key={subQ.id} className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{subQ.label})</span>
                <span className="ml-auto text-sm text-slate-600">[{subQ.marks}]</span>
              </div>
              <div className="ml-4 space-y-2">
                {subQ.blocks.map((block) => (
                  <BlockRenderer key={block.id} block={block} />
                ))}
              </div>
              {showAnswerSpace && (
                <div className="ml-4 mt-2">
                  <AnswerSpace lines={Math.max(2, Math.floor(subQ.marks / 2))} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Answer Space for non-creative questions */}
      {showAnswerSpace && question.type !== 'creative' && question.type !== 'mcq' && (
        <div className="ml-6 mt-3">
          <AnswerSpace lines={Math.max(3, Math.floor(question.marks / 2))} />
        </div>
      )}
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <p className="text-base leading-relaxed font-['Noto_Sans_Bengali']">
          {block.content.text}
        </p>
      );

    case 'formula':
      if (!block.content.latex) return null;
      return (
        <div className="my-3">
          <SafeKaTeX math={block.content.latex} />
        </div>
      );

    case 'image':
      if (!block.content.url) return null;
      return (
        <div className="my-3">
          <img 
            src={block.content.url} 
            alt="Question" 
            className="max-w-md border border-slate-200 rounded"
          />
        </div>
      );

    case 'table':
      const rows = block.content.rows || 2;
      const cols = block.content.cols || 2;
      
      // Initialize headers and data if missing (for backward compatibility)
      const headers = block.content.headers || Array(cols).fill('');
      const data = block.content.data || Array.from({ length: rows }, () => Array(cols).fill(''));
      
      return (
        <div className="my-3">
          <table className="border-collapse border border-slate-300 w-auto">
            {/* Table Header */}
            {headers.length > 0 && headers.some((h: string) => h && h.trim() !== '') && (
              <thead>
                <tr>
                  {headers.map((header: string, idx: number) => (
                    <th
                      key={idx}
                      className="border border-slate-300 px-3 py-2 bg-slate-100 font-semibold text-left font-['Noto_Sans_Bengali']"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            
            {/* Table Body */}
            <tbody>
              {data.map((rowData: string[], rowIdx: number) => (
                <tr key={rowIdx}>
                  {rowData.map((cellData: string, colIdx: number) => (
                    <td
                      key={colIdx}
                      className="border border-slate-300 px-3 py-2 min-w-[80px] font-['Noto_Sans_Bengali']"
                    >
                      {cellData}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'diagram':
      return (
        <div className="my-3 p-4 border border-dashed border-slate-300 rounded bg-slate-50">
          <p className="text-sm text-slate-600 italic">
            [{block.content.description || 'চিত্র'}]
          </p>
        </div>
      );

    case 'list':
      if (!block.content.items || block.content.items.length === 0) return null;
      return (
        <ul className="list-disc list-inside space-y-1 my-2">
          {block.content.items.map((item: string, idx: number) => (
            item.trim() && <li key={idx} className="text-base">{item}</li>
          ))}
        </ul>
      );

    case 'blank':
      return <AnswerSpace lines={block.content.lines || 1} />;

    default:
      return null;
  }
}

function AnswerSpace({ lines }: { lines: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, idx) => (
        <div key={idx} className="border-b border-dotted border-slate-300 h-6" />
      ))}
    </div>
  );
}