/**
 * =====================================================
 * Block Editor Component
 * =====================================================
 * Question এর content তৈরি করার জন্য block-based editor
 * 
 * Supported Block Types:
 * 1. Text - সাধারণ টেক্সট লেখা
 * 2. Formula - LaTeX দিয়ে গণিত সূত্র
 * 3. Image - ছবি যোগ করা
 * 4. Table - টেবিল তৈরি করা (headers + data rows)
 * 5. Diagram - চিত্রের বিবরণ
 * 6. List - Bullet point তালিকা
 * 7. Blank - উত্তর লেখার জন্য ফাঁকা স্থান
 * 
 * Features:
 * - Add/Remove blocks
 * - Reorder blocks (up/down)
 * - Real-time editing
 * - Default content for each block type
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Type, 
  Sigma as FunctionIcon, 
  Image, 
  Table, 
  Pen, 
  Minus,
  GripVertical,
  Plus,
  List
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { MathSymbolHelper } from '../helpers/MathSymbolHelper';
import { SafeKaTeX } from '../helpers/SafeKaTeX';
import { getDefaultBlockContent } from '../../utils/blockHelpers';

/**
 * BlockEditor Component
 * @param {Object} props
 * @param {Array} props.blocks - Blocks এর array
 * @param {Function} props.onChange - Blocks change হলে call হয়
 */
export function BlockEditor({ blocks, onChange }) {
  // ==================== State ====================
  
  // selectedBlockType - যে block type add করা হবে
  const [selectedBlockType, setSelectedBlockType] = useState('text');

  // ==================== Block Management ====================

  /**
   * নতুন block add করে
   * @param {string} type - Block type (text, formula, table, etc.)
   */
  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`, // Unique ID generate করা
      type: type,
      content: getDefaultBlockContent(type), // Default content from utils
    };
    onChange([...blocks, newBlock]); // Parent component কে update জানানো
  };

  /**
   * Block এর content update করে
   * @param {string} id - Block ID
   * @param {Object} content - নতুন content object
   */
  const updateBlock = (id, content) => {
    // Block খুঁজে বের করো এবং content update করো
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    onChange(updatedBlocks);
  };

  /**
   * Block remove/delete করে
   * @param {string} id - Block ID
   */
  const removeBlock = (id) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  /**
   * Block এর position change করে (up/down)
   * @param {number} index - Block এর current index
   * @param {string} direction - 'up' অথবা 'down'
   */
  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Check করো move করা সম্ভব কিনা
    if (newIndex >= 0 && newIndex < blocks.length) {
      // Swap করো দুটো blocks
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      onChange(newBlocks);
    }
  };

  // ==================== Render ====================

  return (
    <div className="space-y-4">
      {/* ==================== Existing Blocks List ==================== */}
      {blocks.map((block, index) => (
        <div 
          key={block.id} 
          className="border border-slate-200 rounded-lg p-4 bg-white group"
        >
          <div className="flex items-start gap-3">
            {/* Move Handle (Up/Down buttons) */}
            <div className="flex flex-col gap-1 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0} // প্রথম block up করা যাবে না
              >
                <GripVertical className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Block Content Editor */}
            <div className="flex-1">
              <BlockRenderer 
                block={block} 
                onChange={(content) => updateBlock(block.id, content)} 
              />
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 opacity-0 group-hover:opacity-100"
              onClick={() => removeBlock(block.id)}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* ==================== Add New Block Section ==================== */}
      <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50">
        <div className="flex items-center gap-3">
          {/* Block Type Selector */}
          <Select 
            value={selectedBlockType} 
            onValueChange={(value) => setSelectedBlockType(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* Text Block */}
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>টেক্সট</span>
                </div>
              </SelectItem>

              {/* Formula Block */}
              <SelectItem value="formula">
                <div className="flex items-center gap-2">
                  <FunctionIcon className="w-4 h-4" />
                  <span>সূত্র/ফর্মুলা</span>
                </div>
              </SelectItem>

              {/* Image Block */}
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  <span>ছবি</span>
                </div>
              </SelectItem>

              {/* Table Block */}
              <SelectItem value="table">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  <span>টেবিল</span>
                </div>
              </SelectItem>

              {/* Diagram Block */}
              <SelectItem value="diagram">
                <div className="flex items-center gap-2">
                  <Pen className="w-4 h-4" />
                  <span>চিত্র/ডায়াগ্রাম</span>
                </div>
              </SelectItem>

              {/* List Block */}
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>তালিকা</span>
                </div>
              </SelectItem>

              {/* Blank Space Block */}
              <SelectItem value="blank">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4" />
                  <span>ফাঁকা স্থান</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Add Block Button */}
          <Button onClick={() => addBlock(selectedBlockType)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            ব্লক যোগ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * =====================================================
 * BlockRenderer Component
 * =====================================================
 * প্রতিটি block type এর জন্য specific editor render করে
 * 
 * @param {Object} props
 * @param {Object} props.block - Block object (id, type, content)
 * @param {Function} props.onChange - Content change handler
 */
function BlockRenderer({ block, onChange }) {
  // Block type অনুযায়ী আলাদা editor দেখানো হচ্ছে
  switch (block.type) {
    // ==================== Text Block ====================
    case 'text':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">টেক্সট</Label>
          <Textarea
            value={block.content.text || ''}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="প্রশ্ন বা বিবরণ লিখুন..."
            rows={3}
            className="font-['Noto_Sans_Bengali']"
          />
        </div>
      );

    // ==================== Formula Block ====================
    case 'formula':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">গণিত সূত্র (LaTeX)</Label>
          
          {/* LaTeX Input */}
          <Input
            value={block.content.latex || ''}
            onChange={(e) => onChange({ latex: e.target.value })}
            placeholder="যেমন: x^2 + y^2 = r^2"
          />
          
          {/* LaTeX Preview */}
          {block.content.latex && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <SafeKaTeX math={block.content.latex} />
            </div>
          )}
          
          {/* Tips & Math Symbol Helper */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              টিপস: x^2 (পাওয়ার), \frac{'{a}{b}'} (ভগ্নাংশ), \sqrt{'{x}'} (বর্গমূল)
            </p>
            <MathSymbolHelper 
              onInsert={(latex) => {
                onChange({ latex: (block.content.latex || '') + latex });
              }} 
            />
          </div>
        </div>
      );

    // ==================== Image Block ====================
    case 'image':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">ছবি URL</Label>
          
          {/* Image URL Input */}
          <Input
            value={block.content.url || ''}
            onChange={(e) => onChange({ ...block.content, url: e.target.value })}
            placeholder="ছবির লিংক দিন"
          />
          
          {/* Image Preview */}
          {block.content.url && (
            <img 
              src={block.content.url} 
              alt="Preview" 
              className="max-w-xs rounded border" 
            />
          )}
        </div>
      );

    // ==================== Table Block ====================
    case 'table':
      return (
        <div className="space-y-3">
          <Label className="text-xs text-slate-500">টেবিল</Label>
          
          {/* ==================== Table Dimensions ==================== */}
          <div className="grid grid-cols-2 gap-2">
            {/* Rows Input */}
            <div>
              <Label className="text-xs">সারি (Rows)</Label>
              <Input
                type="number"
                value={block.content.rows || 2}
                onChange={(e) => {
                  const newRows = parseInt(e.target.value) || 2;
                  const currentData = block.content.data || [];
                  
                  // নতুন rows সংখ্যা অনুযায়ী data array adjust করো
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

            {/* Columns Input */}
            <div>
              <Label className="text-xs">কলাম (Columns)</Label>
              <Input
                type="number"
                value={block.content.cols || 2}
                onChange={(e) => {
                  const newCols = parseInt(e.target.value) || 2;
                  const currentHeaders = block.content.headers || [];
                  const currentData = block.content.data || [];
                  
                  // নতুন columns সংখ্যা অনুযায়ী headers adjust করো
                  const newHeaders = Array.from({ length: newCols }, (_, i) => 
                    currentHeaders[i] || ''
                  );
                  
                  // প্রতিটি row এ নতুন columns adjust করো
                  const newData = currentData.map(row => 
                    Array.from({ length: newCols }, (_, i) => row[i] || '')
                  );
                  
                  onChange({ 
                    ...block.content, 
                    cols: newCols, 
                    headers: newHeaders, 
                    data: newData 
                  });
                }}
                placeholder="কলাম"
                min="1"
                max="10"
              />
            </div>
          </div>

          {/* ==================== Table Headers ==================== */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Header Row</Label>
            <div 
              className="grid gap-2" 
              style={{ gridTemplateColumns: `repeat(${block.content.cols || 2}, 1fr)` }}
            >
              {Array.from({ length: block.content.cols || 2 }).map((_, colIdx) => {
                const headers = block.content.headers || [];
                return (
                  <Input
                    key={colIdx}
                    value={headers[colIdx] || ''}
                    onChange={(e) => {
                      // Headers array এর deep copy করো
                      const newHeaders = [
                        ...(block.content.headers || Array(block.content.cols || 2).fill(''))
                      ];
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

          {/* ==================== Table Body (Data Rows) ==================== */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Table Body</Label>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-slate-200 rounded p-2">
              {/* প্রতিটি row এর জন্য inputs */}
              {Array.from({ length: block.content.rows || 2 }).map((_, rowIdx) => {
                const data = block.content.data || [];
                const row = data[rowIdx] || [];
                
                return (
                  <div key={rowIdx} className="space-y-1">
                    <Label className="text-xs text-slate-400">সারি {rowIdx + 1}</Label>
                    <div 
                      className="grid gap-2" 
                      style={{ gridTemplateColumns: `repeat(${block.content.cols || 2}, 1fr)` }}
                    >
                      {/* প্রতিটি cell এর জন্য input */}
                      {Array.from({ length: block.content.cols || 2 }).map((_, colIdx) => (
                        <Input
                          key={colIdx}
                          value={row[colIdx] || ''}
                          onChange={(e) => {
                            // IMPORTANT: Deep copy করো data array টা
                            // এটা না করলে table data properly save হবে না!
                            const currentData = block.content.data || 
                              Array.from({ length: block.content.rows || 2 }, () => 
                                Array(block.content.cols || 2).fill('')
                              );
                            
                            // প্রতিটি row এর deep copy করো
                            const newData = currentData.map((r) => [...r]);
                            
                            // Ensure করো এই row exist করে
                            if (!newData[rowIdx]) {
                              newData[rowIdx] = Array(block.content.cols || 2).fill('');
                            }
                            
                            // Specific cell update করো
                            newData[rowIdx][colIdx] = e.target.value;
                            
                            // Parent কে update জানাও
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

          {/* Table Info */}
          <p className="text-xs text-slate-400">
            {block.content.rows || 2} সারি × {block.content.cols || 2} কলাম
          </p>
        </div>
      );

    // ==================== Diagram Block ====================
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

    // ==================== List Block ====================
    case 'list':
      return (
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">
            তালিকা (প্রতি লাইনে একটি আইটেম)
          </Label>
          <Textarea
            value={block.content.items?.join('\n') || ''}
            onChange={(e) => onChange({ items: e.target.value.split('\n') })}
            placeholder="আইটেম ১&#10;আইটেম ২&#10;আইটেম ৩"
            rows={4}
          />
        </div>
      );

    // ==================== Blank Space Block ====================
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

    // ==================== Unknown Block Type ====================
    default:
      return (
        <div className="text-sm text-slate-500">
          অজানা ব্লক টাইপ
        </div>
      );
  }
}
