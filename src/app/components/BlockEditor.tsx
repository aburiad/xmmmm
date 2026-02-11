import { useState } from 'react';
import { Block, BlockType } from '../types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Type, 
  Sigma as FunctionIcon, 
  Image, 
  Table, 
  Pen, 
  BarChart3, 
  Minus,
  GripVertical,
  Plus,
  List
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MathSymbolHelper } from './MathSymbolHelper';
import { SafeKaTeX } from './SafeKaTeX';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>('text');

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: any) => {
    onChange(blocks.map(block => block.id === id ? { ...block, content } : block));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < blocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      onChange(newBlocks);
    }
  };

  return (
    <div className="space-y-4">
      {/* Block List */}
      {blocks.map((block, index) => (
        <div key={block.id} className="border border-slate-200 rounded-lg p-3 md:p-4 bg-white group">
          <div className="flex items-start gap-2 md:gap-3">
            {/* Drag Handle - Hidden on Mobile */}
            <div className="hidden md:flex flex-col gap-1 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0}
              >
                <GripVertical className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <BlockRenderer block={block} onChange={(content) => updateBlock(block.id, content)} />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 opacity-0 group-hover:opacity-100 md:opacity-0 active:opacity-100"
              onClick={() => removeBlock(block.id)}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Add Block */}
      <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 md:p-4 bg-slate-50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Select value={selectedBlockType} onValueChange={(value) => setSelectedBlockType(value as BlockType)}>
            <SelectTrigger className="w-full sm:w-48 h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>টেক্সট</span>
                </div>
              </SelectItem>
              <SelectItem value="formula">
                <div className="flex items-center gap-2">
                  <FunctionIcon className="w-4 h-4" />
                  <span>সূত্র/ফর্মুলা</span>
                </div>
              </SelectItem>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  <span>ছবি</span>
                </div>
              </SelectItem>
              <SelectItem value="table">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  <span>টেবিল</span>
                </div>
              </SelectItem>
              <SelectItem value="diagram">
                <div className="flex items-center gap-2">
                  <Pen className="w-4 h-4" />
                  <span>চিত্র/ডায়াগ্রাম</span>
                </div>
              </SelectItem>
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>তালিকা</span>
                </div>
              </SelectItem>
              <SelectItem value="blank">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4" />
                  <span>ফাঁকা স্থান</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => addBlock(selectedBlockType)} size="sm" className="w-full sm:w-auto h-10">
            <Plus className="w-4 h-4 mr-2" />
            ব্লক যোগ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}

function BlockRenderer({ block, onChange }: { block: Block; onChange: (content: any) => void }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">টেক্সট</Label>
          <Textarea
            value={block.content.text || ''}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="প্রশ্নের অংশ লিখুন..."
            rows={2}
            className="resize-none"
          />
        </div>
      );

    case 'formula':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">গণিত সূত্র (LaTeX)</Label>
          <Textarea
            value={block.content.latex || ''}
            onChange={(e) => onChange({ latex: e.target.value })}
            placeholder="যেমন: x^2 + y^2 = r^2"
            rows={3}
            className="font-mono text-sm"
          />
          {block.content.latex && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <SafeKaTeX math={block.content.latex} />
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-slate-500">
              টিপস: x^2 (পাওয়ার), \\frac{'{a}{b}'} (ভগ্নাংশ), \\sqrt{'{x}'} (বর্গমূল)
            </p>
            <MathSymbolHelper onInsert={(latex) => {
              onChange({ latex: (block.content.latex || '') + latex });
            }} />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-3">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-500 font-semibold">ছবি আপলোড করুন</Label>
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Check file size (max 2MB)
                    if (file.size > 2 * 1024 * 1024) {
                      alert('ছবির সাইজ ২MB এর বেশি হতে পারবে না');
                      return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64 = event.target?.result;
                      onChange({ ...block.content, url: base64 });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full cursor-pointer"
              />
              <p className="text-xs text-slate-400">
                সর্বোচ্চ সাইজ: 2MB | ফরম্যাট: JPG, PNG, GIF
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">অথবা</span>
            </div>
          </div>

          {/* URL Input Section */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-500 font-semibold">ছবির URL দিন</Label>
            <Input
              value={block.content.url || ''}
              onChange={(e) => onChange({ ...block.content, url: e.target.value })}
              placeholder="https://example.com/image.png"
              className="w-full"
            />
            <p className="text-xs text-slate-400">
              টিপস: Unsplash, Imgur বা অন্য image hosting সাইট থেকে ছবির লিংক ব্যবহার করুন
            </p>
          </div>
          
          {/* Width and Height Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">প্রস্থ (px)</Label>
              <Input
                type="number"
                min="50"
                max="800"
                value={block.content.width || ''}
                onChange={(e) => onChange({ ...block.content, width: e.target.value })}
                placeholder="যেমন: 300"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">উচ্চতা (px)</Label>
              <Input
                type="number"
                min="50"
                max="800"
                value={block.content.height || ''}
                onChange={(e) => onChange({ ...block.content, height: e.target.value })}
                placeholder="যেমন: 200"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500">ক্যাপশন (ঐচ্ছিক)</Label>
            <Input
              value={block.content.caption || ''}
              onChange={(e) => onChange({ ...block.content, caption: e.target.value })}
              placeholder="ছবির বর্ণনা..."
              className="w-full"
            />
          </div>

          {/* Image Preview */}
          {block.content.url && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <img 
                src={block.content.url} 
                alt={block.content.caption || 'Preview'} 
                style={{
                  width: block.content.width ? `${block.content.width}px` : 'auto',
                  height: block.content.height ? `${block.content.height}px` : 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
                className="rounded"
              />
              {block.content.caption && (
                <p className="text-xs text-slate-500 mt-2 text-center">{block.content.caption}</p>
              )}
            </div>
          )}
        </div>
      );

    case 'table':
      return (
        <div className="space-y-3">
          <Label className="text-xs text-slate-500">টেবিল</Label>
          
          {/* Table dimensions */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">সারি (Rows)</Label>
              <Input
                type="number"
                value={block.content.rows || 2}
                onChange={(e) => {
                  const newRows = parseInt(e.target.value) || 2;
                  const currentData = block.content.data || [];
                  const newData = Array.from({ length: newRows }, (_, i) => 
                    currentData[i] || Array(block.content.cols || 2).fill('')
                  );
                  onChange({ ...block.content, rows: newRows, data: newData });
                }}
                placeholder="সারি"
                min="1"
                max="10"
              />
            </div>
            <div>
              <Label className="text-xs">কলাম (Columns)</Label>
              <Input
                type="number"
                value={block.content.cols || 2}
                onChange={(e) => {
                  const newCols = parseInt(e.target.value) || 2;
                  const currentHeaders = block.content.headers || [];
                  const currentData = block.content.data || [];
                  
                  const newHeaders = Array.from({ length: newCols }, (_, i) => 
                    currentHeaders[i] || ''
                  );
                  const newData = currentData.map(row => 
                    Array.from({ length: newCols }, (_, i) => row[i] || '')
                  );
                  
                  onChange({ ...block.content, cols: newCols, headers: newHeaders, data: newData });
                }}
                placeholder="কলাম"
                min="1"
                max="10"
              />
            </div>
          </div>

          {/* Table Headers */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Header Row</Label>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${block.content.cols || 2}, 1fr)` }}>
              {Array.from({ length: block.content.cols || 2 }).map((_, colIdx) => {
                const headers = block.content.headers || [];
                return (
                  <Input
                    key={colIdx}
                    value={headers[colIdx] || ''}
                    onChange={(e) => {
                      const newHeaders = [...(block.content.headers || Array(block.content.cols || 2).fill(''))];
                      newHeaders[colIdx] = e.target.value;
                      onChange({ ...block.content, headers: newHeaders });
                    }}
                    placeholder={`কলাম ${colIdx + 1}`}
                    className="text-sm font-['Noto_Sans_Bengali']"
                  />
                );
              })}
            </div>
          </div>

          {/* Table Body */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Table Body</Label>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-slate-200 rounded p-2">
              {Array.from({ length: block.content.rows || 2 }).map((_, rowIdx) => {
                const data = block.content.data || [];
                const row = data[rowIdx] || [];
                
                return (
                  <div key={rowIdx} className="space-y-1">
                    <Label className="text-xs text-slate-400">সারি {rowIdx + 1}</Label>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${block.content.cols || 2}, 1fr)` }}>
                      {Array.from({ length: block.content.cols || 2 }).map((_, colIdx) => (
                        <Input
                          key={colIdx}
                          value={row[colIdx] || ''}
                          onChange={(e) => {
                            // Deep clone the data array
                            const currentData = block.content.data || Array.from({ length: block.content.rows || 2 }, () => Array(block.content.cols || 2).fill(''));
                            const newData = currentData.map((r: string[]) => [...r]); // Deep copy each row
                            
                            // Ensure row exists
                            if (!newData[rowIdx]) {
                              newData[rowIdx] = Array(block.content.cols || 2).fill('');
                            }
                            
                            // Update the specific cell
                            newData[rowIdx][colIdx] = e.target.value;
                            
                            onChange({ ...block.content, data: newData });
                          }}
                          placeholder={`R${rowIdx + 1}C${colIdx + 1}`}
                          className="text-sm font-['Noto_Sans_Bengali']"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {block.content.rows || 2} সারি × {block.content.cols || 2} কলাম
          </p>
        </div>
      );

    case 'diagram':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">চিত্র বিবরণ</Label>
          <Textarea
            value={block.content.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="চিত্রটির বিবরণ লিখুন (যেমন: একটি সমকোণী ত্রিভুজ ABC)"
            rows={2}
          />
        </div>
      );

    case 'list':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">তালিকা (প্রতি লাইনে একটি আইটেম)</Label>
          <Textarea
            value={block.content.items?.join('\n') || ''}
            onChange={(e) => onChange({ items: e.target.value.split('\n') })}
            placeholder="আইটেম ১&#10;আইটেম ২&#10;আইটেম ৩"
            rows={4}
          />
        </div>
      );

    case 'blank':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">ফাঁকা স্থান</Label>
          <Input
            type="number"
            value={block.content.lines || 1}
            onChange={(e) => onChange({ lines: parseInt(e.target.value) || 1 })}
            placeholder="লাইন সংখ্যা"
            min="1"
            max="10"
          />
        </div>
      );

    default:
      return <div className="text-sm text-slate-500">অজানা ব্লক টাইপ</div>;
  }
}

function getDefaultContent(type: BlockType): any {
  switch (type) {
    case 'text':
      return { text: '' };
    case 'formula':
      return { latex: '' };
    case 'image':
      return { url: '' };
    case 'table':
      return { 
        rows: 2, 
        cols: 2,
        headers: ['হেডার ১', 'হেডার ২'],
        data: [['ঘর ১', 'ঘর ২'], ['ঘর ৩', 'ঘর ৪']]
      };
    case 'diagram':
      return { description: '' };
    case 'list':
      return { items: [] };
    case 'blank':
      return { lines: 1 };
    default:
      return {};
  }
}