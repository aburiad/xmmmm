import { BlockMath, InlineMath } from 'react-katex';

interface SafeKaTeXProps {
  math: string;
  display?: boolean;
}

export function SafeKaTeX({ math, display = true }: SafeKaTeXProps) {
  try {
    if (display) {
      return <BlockMath math={math} />;
    }
    return <InlineMath math={math} />;
  } catch (error) {
    return (
      <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
        <strong>LaTeX Error:</strong> {math}
        <p className="text-xs mt-1">সূত্রটি সঠিকভাবে লেখা হয়নি। অনুগ্রহ করে যাচাই করুন।</p>
      </div>
    );
  }
}
