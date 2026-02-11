# 📚 বাংলাদেশ বোর্ড প্রশ্নপত্র জেনারেটর
# Bangladesh Education Board Question Paper Generator

একটি comprehensive web-based question paper generator যা Bangladesh Education Board (Class 6-10) এর জন্য তৈরি, বিশেষভাবে Mathematics এর জন্য।

---

## 🎯 Features (বৈশিষ্ট্যসমূহ)

### ✅ প্রধান Features:
- ✨ **15+ Question Types** - MCQ, Creative, Short Question, Fill in Blanks, True/False, Matching, Diagram-based, Table, etc.
- 📝 **Block-based Question Builder** - Text, Formula (LaTeX), Image, Table, Diagram, List, Blank Space
- 🎨 **Dynamic UI** - Question type অনুযায়ী UI automatically adapt হয়
- 📄 **A4 PDF Export** - Board standards অনুসরণ করে professional PDF তৈরি
- 🔤 **Bangla Typography** - Proper Bangla font support (Noto Sans Bengali)
- ➗ **Math Formula Editor** - LaTeX support সহ math symbols helper
- 🎓 **Creative Question Flow** - Sub-questions (ক, খ, গ, ঘ) support
- 💾 **LocalStorage Persistence** - Data locally save হয়, কোনো server দরকার নেই
- 🖨️ **Print Functionality** - Direct print support
- 📱 **Responsive Design** - Desktop এবং mobile উভয়ে কাজ করে

---

## 📁 Project Structure (ফাইল ও ফোল্ডার গঠন)

```
/src/
  ├── /config/                  ← Configuration files
  │   └── constants.js          ← সব constant values (question types, classes, etc.)
  │
  ├── /utils/                   ← Helper functions
  │   ├── storage.js            ← LocalStorage operations (save, load, delete papers)
  │   ├── formatters.js         ← Date/number formatting (Bangla conversion)
  │   └── blockHelpers.js       ← Block related helpers (default content, validation)
  │
  ├── /pages/                   ← All pages
  │   ├── Dashboard.jsx         ← Home page (papers list)
  │   ├── PaperSetup.jsx        ← Paper setup form
  │   ├── QuestionBuilder.jsx   ← Question builder (main editor)
  │   ├── A4Preview.jsx         ← A4 preview & PDF export
  │   └── NotFound.jsx          ← 404 error page
  │
  ├── /components/              ← Reusable components
  │   ├── /blocks/              ← Block related components
  │   │   ├── BlockEditor.jsx   ← Block editor (text, formula, table, etc.)
  │   │   └── BlockRenderer.jsx ← Block preview renderer
  │   │
  │   ├── /question/            ← Question related components
  │   │   └── QuestionRenderer.jsx  ← Question preview
  │   │
  │   ├── /layout/              ← Layout components
  │   │   └── BoardStyleLayout.jsx  ← Board-style layout for preview
  │   │
  │   ├── /helpers/             ← Helper components
  │   │   ├── MathSymbolHelper.jsx  ← Math symbols popup
  │   │   ├── SafeKaTeX.jsx         ← Safe LaTeX renderer
  │   │   └── HelpDialog.jsx        ← Help/Guide dialog
  │   │
  │   └── /ui/                  ← UI components (from shadcn)
  │       ├── button.jsx
  │       ├── card.jsx
  │       ├── input.jsx
  │       ├── select.jsx
  │       └── ... (অন্যান্য UI components)
  │
  ├── App.jsx                   ← Main app component
  ├── routes.js                 ← React Router configuration
  └── main.jsx                  ← Entry point

/CONVERSION_GUIDE.md           ← TypeScript to JavaScript conversion guide
/README.md                      ← এই ফাইল (project documentation)
```

---

## 🚀 Getting Started (কীভাবে শুরু করবেন)

### Prerequisites (প্রয়োজনীয়):
- Node.js (v16 বা তার উপরে)
- npm বা pnpm

### Installation:
```bash
# Repository clone করুন
git clone <repository-url>

# Project directory তে যান
cd question-paper-generator

# Dependencies install করুন
npm install
# অথবা
pnpm install

# Development server চালু করুন
npm run dev
# অথবা
pnpm dev
```

Server চালু হলে browser এ `http://localhost:5173` খুলুন।

---

## 📖 How It Works (কিভাবে কাজ করে)

### 1. Dashboard (হোমপেজ)
- সব question papers এর list দেখায়
- নতুন paper তৈরি, edit, delete, duplicate করা যায়

### 2. Paper Setup
- পরীক্ষার basic information দেওয়া হয়:
  - Subject (বিষয়)
  - Class (শ্রেণি)
  - Chapter (অধ্যায়)
  - Exam Type (পরীক্ষার ধরন)
  - Time & Marks (সময় ও নম্বর)
  - School Name (ঐচ্ছিক)

### 3. Question Builder
- Question তৈরি ও edit করা হয়
- 15+ question types থেকে select করা যায়
- Block-based editor দিয়ে question content যোগ করা যায়:
  - **Text Block**: সাধারণ text লেখা
  - **Formula Block**: LaTeX দিয়ে math formula
  - **Image Block**: ছবি add করা
  - **Table Block**: টেবিল তৈরি করা
  - **Diagram Block**: চিত্রের বিবরণ
  - **List Block**: Bullet points
  - **Blank Space**: উত্তর লেখার জায়গা

### 4. A4 Preview & Export
- Real-time A4 format preview
- Board-style formatting
- PDF export (download করা যায়)
- Direct print support

---

## 🔧 Key Technologies (প্রযুক্তি)

- **React 18** - UI library
- **React Router v6** - Routing (Data mode)
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **KaTeX** - Math formula rendering
- **html2canvas + jsPDF** - PDF generation
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **LocalStorage** - Data persistence

---

## 💡 For Junior Developers (নতুন ডেভেলপারদের জন্য)

### 📚 Learning Resources:

1. **React Basics:**
   - [React Official Docs](https://react.dev)
   - Hooks: useState, useEffect, useNavigate
   - Components & Props
   - Event Handling

2. **JavaScript ES6+:**
   - Arrow Functions
   - Destructuring
   - Spread Operator
   - Array Methods (map, filter, find)

3. **Tailwind CSS:**
   - [Tailwind Docs](https://tailwindcss.com)
   - Utility classes
   - Responsive design

### 🎓 কিভাবে Code বুঝবেন:

#### Step 1: Config ফাইল দেখুন
```javascript
// /src/config/constants.js
// এখানে সব configuration আছে
// Junior developer এখানে সহজে values change করতে পারবে
```

#### Step 2: Utils Functions দেখুন
```javascript
// /src/utils/storage.js
// LocalStorage এর সব operations এখানে
// savePaper, loadPapers, deletePaper, etc.
```

#### Step 3: Components দেখুন
```javascript
// /src/pages/Dashboard.jsx
// প্রতিটি component এ detailed Bangla comments আছে
// প্রতিটি function এ @param এবং @returns documentation আছে
```

### 🔍 Code Pattern:

প্রতিটি component এ এই pattern follow করা হয়েছে:

```javascript
/**
 * Component বিবরণ
 */
export default function ComponentName() {
  // ==================== State Management ====================
  const [state, setState] = useState(initialValue);
  
  // ==================== Effects ====================
  useEffect(() => {
    // Side effects এখানে
  }, []);
  
  // ==================== Event Handlers ====================
  const handleEvent = () => {
    // Event handling logic
  };
  
  // ==================== Render ====================
  return (
    <div>
      {/* JSX code with comments */}
    </div>
  );
}
```

---

## 🐛 Debugging Tips (সমস্যা সমাধান)

### Console Logs:
Development mode এ, table data saving/loading এর জন্য console logs আছে:

```javascript
// Check browser console (F12)
// আপনি দেখবেন:
📊 Saving Table in Q1 Block1: {...}
📥 Loaded Table from Paper1 Q1 Block1: {...}
```

### Common Issues:

1. **Table data দেখা যাচ্ছে না?**
   - Browser console check করুন
   - `data` array empty কিনা দেখুন
   - LocalStorage clear করে নতুন করে try করুন

2. **LaTeX formula render হচ্ছে না?**
   - KaTeX CSS properly loaded আছে কিনা check করুন
   - LaTeX syntax ঠিক আছে কিনা verify করুন

3. **PDF export কাজ করছে না?**
   - Mobile এ PDF download না হলে, Print dialog ব্যবহার করুন
   - "Save as PDF" option select করুন

---

## 📝 টাইপস্ক্রিপ্ট থেকে জাভাস্ক্রিপ্ট Conversion

যদি TypeScript (.tsx) files JavaScript (.jsx) এ convert করতে চান, তাহলে `/CONVERSION_GUIDE.md` দেখুন।

বর্তমানে converted files:
- ✅ `/src/config/constants.js`
- ✅ `/src/utils/storage.js`
- ✅ `/src/utils/formatters.js`
- ✅ `/src/utils/blockHelpers.js`
- ✅ `/src/routes.js`
- ✅ `/src/App.jsx`
- ✅ `/src/pages/Dashboard.jsx`
- ✅ `/src/pages/NotFound.jsx`

বাকি files convert করতে চাইলে CONVERSION_GUIDE.md follow করুন।

---

## 🤝 Contributing (অবদান)

নতুন feature যোগ করতে বা bug fix করতে চাইলে:

1. Code এর existing pattern follow করুন
2. প্রতিটি function এ Bangla/English comment লিখুন
3. JSDoc style documentation ব্যবহার করুন
4. Test করুন সব features কাজ করছে কিনা

---

## 📄 License

MIT License - শিক্ষামূলক উদ্দেশ্যে ব্যবহার করা যাবে।

---

## 📞 Support

সমস্যা হলে GitHub Issues এ জানান অথবা documentation দেখুন।

**Happy Coding! 🚀**
# xmmmm
