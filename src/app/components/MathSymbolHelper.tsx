import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { HelpCircle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface MathSymbol {
  symbol: string;
  latex: string;
  description: string;
}

const MATH_SYMBOLS: MathSymbol[] = [
  { symbol: 'x²', latex: 'x^2', description: 'পাওয়ার/ঘাত' },
  { symbol: '√', latex: '\\sqrt{x}', description: 'বর্গমূল' },
  { symbol: '∛', latex: '\\sqrt[3]{x}', description: 'ঘনমূল' },
  { symbol: '½', latex: '\\frac{1}{2}', description: 'ভগ্নাংশ' },
  { symbol: 'a/b', latex: '\\frac{a}{b}', description: 'ভগ্নাংশ' },
  { symbol: '∑', latex: '\\sum_{i=1}^{n}', description: 'সমষ্টি' },
  { symbol: '∫', latex: '\\int_{a}^{b}', description: 'সমাকলন' },
  { symbol: 'π', latex: '\\pi', description: 'পাই' },
  { symbol: '∞', latex: '\\infty', description: 'অসীম' },
  { symbol: '≤', latex: '\\leq', description: 'ছোট বা সমান' },
  { symbol: '≥', latex: '\\geq', description: 'বড় বা সমান' },
  { symbol: '≠', latex: '\\neq', description: 'সমান নয়' },
  { symbol: '≈', latex: '\\approx', description: 'প্রায় সমান' },
  { symbol: '°', latex: '^\\circ', description: 'ডিগ্রি' },
  { symbol: 'sin', latex: '\\sin', description: 'সাইন' },
  { symbol: 'cos', latex: '\\cos', description: 'কোসাইন' },
  { symbol: 'tan', latex: '\\tan', description: 'ট্যানজেন্ট' },
  { symbol: 'log', latex: '\\log', description: 'লগারিদম' },
  { symbol: 'α', latex: '\\alpha', description: 'আলফা' },
  { symbol: 'β', latex: '\\beta', description: 'বিটা' },
  { symbol: 'θ', latex: '\\theta', description: 'থিটা' },
];

interface MathSymbolHelperProps {
  onInsert: (latex: string) => void;
}

export function MathSymbolHelper({ onInsert }: MathSymbolHelperProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <HelpCircle className="w-4 h-4 mr-2" />
          গণিত চিহ্ন
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">সাধারণ গণিত চিহ্ন</h4>
            <p className="text-xs text-slate-500 mb-3">
              ক্লিক করে সরাসরি যোগ করুন বা LaTeX কোড ব্যবহার করুন
            </p>
          </div>
          
          <ScrollArea className="h-[300px] pr-3">
            <div className="grid grid-cols-2 gap-2">
              {MATH_SYMBOLS.map((symbol, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onInsert(symbol.latex)}
                  className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left"
                >
                  <span className="text-lg font-mono">{symbol.symbol}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-slate-600 truncate">
                      {symbol.latex}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {symbol.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <h5 className="text-xs font-medium text-slate-700">দ্রুত টিপস:</h5>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• সাবস্ক্রিপ্ট: x_1 → x₁</li>
              <li>• সুপারস্ক্রিপ্ট: x^2 → x²</li>
              <li>• কার্লি ব্রেস: {'{}'} ব্যবহার করুন</li>
              <li>• ভগ্নাংশ: \frac{'{numerator}{denominator}'}</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
