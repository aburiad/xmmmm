# TypeScript to JavaScript Conversion Guide
# টাইপস্ক্রিপ্ট থেকে জাভাস্ক্রিপ্ট রূপান্তর গাইড

এই গাইড অনুসরণ করে সহজেই TypeScript (.tsx) files কে JavaScript (.jsx) এ convert করতে পারবেন।

## 📁 নতুন Folder Structure (New Folder Structure)

```
/src/
  /config/              ← Configuration files (constants, settings)
    constants.js        ← সব constant values এখানে
  
  /utils/               ← Helper functions
    storage.js          ← LocalStorage functions
    formatters.js       ← Date/number formatting
    blockHelpers.js     ← Block related helpers
  
  /pages/               ← All pages
    Dashboard.jsx       ← Home page
    PaperSetup.jsx      ← Paper setup page
    QuestionBuilder.jsx ← Question builder page
    A4Preview.jsx       ← Preview page
    NotFound.jsx        ← 404 page
  
  /components/          ← Reusable components
    /blocks/            ← Block related components
      BlockEditor.jsx
      BlockRenderer.jsx
    /question/          ← Question related components
      QuestionRenderer.jsx
    /layout/            ← Layout components
      BoardStyleLayout.jsx
    /helpers/           ← Helper components
      MathSymbolHelper.jsx
      SafeKaTeX.jsx
      HelpDialog.jsx
    /ui/                ← UI components (shadcn)
      button.jsx
      card.jsx
      input.jsx
      ... etc
  
  App.jsx               ← Main app component
  routes.js             ← Routes configuration
  main.jsx              ← Entry point (index.html এ link হবে)
```

## 🔄 Conversion Steps (রূপান্তর ধাপসমূহ)

### Step 1: File Extension পরিবর্তন করুন
- `.tsx` → `.jsx`
- `.ts` → `.js`

### Step 2: Import Statements পরিবর্তন করুন

**Before (TypeScript):**
```typescript
import { QuestionPaper, Question } from '../types';
import { loadPapers } from '../utils/storage';
```

**After (JavaScript):**
```javascript
// Types import করার দরকার নেই
import { loadPapers } from '../utils/storage';
```

### Step 3: Type Annotations সরিয়ে ফেলুন

**Before (TypeScript):**
```typescript
const [papers, setPapers] = useState<QuestionPaper[]>([]);
const [selectedId, setSelectedId] = useState<string | null>(null);

function handleDelete(id: string): void {
  deletePaper(id);
}
```

**After (JavaScript):**
```javascript
const [papers, setPapers] = useState([]);
const [selectedId, setSelectedId] = useState(null);

function handleDelete(id) {
  deletePaper(id);
}
```

### Step 4: Interface/Type Definitions সরিয়ে ফেলুন

**Before (TypeScript):**
```typescript
interface DashboardProps {
  title: string;
  count: number;
}

export default function Dashboard({ title, count }: DashboardProps) {
  // ...
}
```

**After (JavaScript):**
```javascript
/**
 * Dashboard Component
 * @param {Object} props - Component props
 * @param {string} props.title - Dashboard title
 * @param {number} props.count - Item count
 */
export default function Dashboard({ title, count }) {
  // ...
}
```

### Step 5: Type Assertions সরিয়ে ফেলুন

**Before (TypeScript):**
```typescript
const data = response.data as QuestionPaper;
const element = document.getElementById('root') as HTMLElement;
```

**After (JavaScript):**
```javascript
const data = response.data;
const element = document.getElementById('root');
```

### Step 6: Generic Types সরিয়ে ফেলুন

**Before (TypeScript):**
```typescript
const items = Array<string>();
const map = new Map<string, number>();
```

**After (JavaScript):**
```javascript
const items = [];
const map = new Map();
```

## 📝 Comment Guidelines (কমেন্ট লেখার নিয়ম)

### Function Comments

```javascript
/**
 * ফাংশনের সংক্ষিপ্ত বিবরণ (Bangla)
 * Brief description in English
 * 
 * @param {type} paramName - Parameter description
 * @returns {type} - Return value description
 */
function functionName(paramName) {
  // Code here
}
```

### Example:

```javascript
/**
 * Question paper delete করে localStorage থেকে
 * Deletes a question paper from localStorage
 * 
 * @param {string} id - Paper এর unique ID
 * @returns {boolean} - Success হলে true, না হলে false
 */
function deletePaper(id) {
  try {
    const papers = loadPapers();
    const filtered = papers.filter(p => p.id !== id);
    savePapers(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting paper:', error);
    return false;
  }
}
```

### Component Comments

```javascript
/**
 * =====================================================
 * Component Name
 * =====================================================
 * Component এর বিস্তারিত বিবরণ Bangla তে
 * Detailed description in English
 * 
 * Props:
 * - propName (type): Description
 * 
 * Example Usage:
 * <ComponentName propName="value" />
 */
export default function ComponentName({ propName }) {
  // Component code
}
```

### Inline Comments

```javascript
// useState hook - papers এর list রাখার জন্য
const [papers, setPapers] = useState([]);

// Effect - Component mount হলে papers load করে
useEffect(() => {
  setPapers(loadPapers());
}, []);

// Handler - Delete button click করলে paper মুছে ফেলে
const handleDelete = (id) => {
  deletePaper(id);
  setPapers(loadPapers()); // Reload papers after delete
  toast.success('প্রশ্নপত্র মুছে ফেলা হয়েছে');
};
```

## 🎯 Complete Example: Converting a Component

### BEFORE (TypeScript):

```typescript
import { useState } from 'react';
import { Button } from './ui/button';
import { QuestionPaper } from '../types';

interface QuestionListProps {
  papers: QuestionPaper[];
  onSelect: (id: string) => void;
}

export function QuestionList({ papers, onSelect }: QuestionListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (id: string): void => {
    setSelectedId(id);
    onSelect(id);
  };

  return (
    <div className="space-y-2">
      {papers.map((paper: QuestionPaper) => (
        <Button
          key={paper.id}
          onClick={() => handleClick(paper.id)}
          variant={selectedId === paper.id ? 'default' : 'outline'}
        >
          {paper.setup.subject}
        </Button>
      ))}
    </div>
  );
}
```

### AFTER (JavaScript):

```javascript
/**
 * =====================================================
 * Question List Component
 * =====================================================
 * Question papers এর list দেখায় এবং select করা যায়
 * 
 * Props:
 * - papers (Array): Question papers এর array
 * - onSelect (Function): Paper select করলে call হয়
 * 
 * Example:
 * <QuestionList 
 *   papers={myPapers} 
 *   onSelect={(id) => console.log(id)} 
 * />
 */

import { useState } from 'react';
import { Button } from './ui/button';

export function QuestionList({ papers, onSelect }) {
  // State - কোন paper select করা আছে তা track করে
  const [selectedId, setSelectedId] = useState(null);

  /**
   * Button click handler
   * @param {string} id - Paper এর ID
   */
  const handleClick = (id) => {
    setSelectedId(id); // Local state update করো
    onSelect(id); // Parent component কে জানাও
  };

  return (
    <div className="space-y-2">
      {/* সব papers loop করে button তৈরি করো */}
      {papers.map((paper) => (
        <Button
          key={paper.id}
          onClick={() => handleClick(paper.id)}
          variant={selectedId === paper.id ? 'default' : 'outline'}
        >
          {paper.setup.subject}
        </Button>
      ))}
    </div>
  );
}
```

## ⚠️ Common Mistakes to Avoid

### ❌ Wrong:
```javascript
// Type annotation রেখে দেওয়া
const [count, setCount] = useState<number>(0);

// Interface import করা
import { QuestionPaper } from '../types';

// Generic type ব্যবহার করা
const items = Array<string>();
```

### ✅ Correct:
```javascript
// Clean JavaScript
const [count, setCount] = useState(0);

// Types import করার দরকার নেই
// import { QuestionPaper } from '../types'; ← এটা সরিয়ে ফেলুন

// Simple array
const items = [];
```

## 🚀 Testing After Conversion

Conversion এর পর এই জিনিসগুলো check করুন:

1. ✅ কোনো TypeScript error আছে কিনা
2. ✅ All imports কাজ করছে কিনা
3. ✅ Props correctly pass হচ্ছে কিনা
4. ✅ State management ঠিক আছে কিনা
5. ✅ Event handlers কাজ করছে কিনা

## 📚 Resources

- [React Documentation](https://react.dev)
- [JavaScript ES6+ Features](https://es6-features.org)
- [JSDoc for Type Hints](https://jsdoc.app)

---

এই guide follow করে সহজেই TypeScript files কে JavaScript এ convert করতে পারবেন! 🎉
