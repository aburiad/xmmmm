/**
 * =====================================================
 * Application Constants & Configuration
 * =====================================================
 * এই ফাইলে সব constant values এবং configuration রাখা হয়েছে
 * Junior developers এখানে সহজে configuration change করতে পারবে
 */

// ==================== Question Types ====================
// বিভিন্ন ধরনের প্রশ্নের তালিকা
export const QUESTION_TYPES = [
  { value: 'mcq', label: 'বহুনির্বাচনী', labelEn: 'MCQ' },
  { value: 'creative', label: 'সৃজনশীল', labelEn: 'Creative' },
  { value: 'short-question', label: 'সংক্ষিপ্ত প্রশ্ন', labelEn: 'Short Question' },
  { value: 'fill-in-blanks', label: 'শূন্যস্থান পূরণ', labelEn: 'Fill in Blanks' },
  { value: 'true-false', label: 'সত্য/মিথ্যা', labelEn: 'True/False' },
  { value: 'matching', label: 'মিলকরণ', labelEn: 'Matching' },
  { value: 'explain', label: 'ব্যাখ্যা', labelEn: 'Explain' },
  { value: 'problem-solving', label: 'সমস্যা সমাধান', labelEn: 'Problem Solving' },
  { value: 'conversion', label: 'রূপান্তর', labelEn: 'Conversion' },
  { value: 'pattern', label: 'প্যাটার্ন', labelEn: 'Pattern' },
  { value: 'diagram', label: 'চিত্র ভিত্তিক', labelEn: 'Diagram Based' },
  { value: 'construction', label: 'অঙ্কন', labelEn: 'Construction' },
  { value: 'table-based', label: 'টেবিল ভিত্তিক', labelEn: 'Table Based' },
  { value: 'graph-based', label: 'গ্রাফ ভিত্তিক', labelEn: 'Graph Based' },
  { value: 'proof', label: 'প্রমাণ', labelEn: 'Proof' },
];

// ==================== Block Types ====================
// প্রশ্নের মধ্যে ব্যবহার করা যায় এমন block types
export const BLOCK_TYPES = [
  { value: 'text', label: 'টেক্সট', icon: 'Type' },
  { value: 'formula', label: 'সূত্র/ফর্মুলা', icon: 'FunctionIcon' },
  { value: 'image', label: 'ছবি', icon: 'Image' },
  { value: 'table', label: 'টেবিল', icon: 'Table' },
  { value: 'diagram', label: 'চিত্র/ডায়াগ্রাম', icon: 'Pen' },
  { value: 'list', label: 'তালিকা', icon: 'List' },
  { value: 'blank', label: 'ফাঁকা স্থান', icon: 'Minus' },
];

// ==================== Class List ====================
// বাংলাদেশ শিক্ষা বোর্ডের ক্লাস তালিকা
export const CLASS_LIST = [
  { value: '6', label: 'ষষ্ঠ শ্রেণি' },
  { value: '7', label: 'সপ্তম শ্রেণি' },
  { value: '8', label: 'অষ্টম শ্রেণি' },
  { value: '9', label: 'নবম শ্রেণি' },
  { value: '10', label: 'দশম শ্রেণি' },
];

// ==================== Exam Types ====================
// বিভিন্ন ধরনের পরীক্ষা
export const EXAM_TYPES = [
  { value: 'class-test', label: 'শ্রেণি পরীক্ষা' },
  { value: 'half-yearly', label: 'অর্ধ-বার্ষিক পরীক্ষা' },
  { value: 'annual', label: 'বার্ষিক পরীক্ষা' },
  { value: 'model-test', label: 'মডেল টেস্ট' },
];

// ==================== Subject List ====================
// বিষয়ের তালিকা
export const SUBJECTS = [
  { value: 'math', label: 'গণিত' },
  { value: 'science', label: 'বিজ্ঞান' },
  { value: 'bangla', label: 'বাংলা' },
  { value: 'english', label: 'ইংরেজি' },
  { value: 'ict', label: 'তথ্য ও যোগাযোগ প্রযুক্তি' },
  { value: 'custom', label: 'অন্যান্য (নিজে লিখুন)' }, // Custom option for user input
];

// ==================== Layout Options ====================
// Question paper এর column layout options
export const LAYOUT_OPTIONS = [
  { value: '1', label: '১ কলাম', description: 'Single column layout' },
  { value: '2', label: '২ কলাম', description: 'Two column layout' },
  { value: '3', label: '৩ কলাম', description: 'Three column layout' },
];

// ==================== Sub-Question Labels ====================
// সৃজনশীল প্রশ্নের উপপ্রশ্ন labels (ক, খ, গ, ঘ)
export const SUB_QUESTION_LABELS = ['ক', 'খ', 'গ', 'ঘ'];

// ==================== LocalStorage Keys ====================
// LocalStorage এ data save করার জন্য keys
export const STORAGE_KEYS = {
  PAPERS: 'bd-board-question-papers',
};

// ==================== PDF Export Settings ====================
// PDF export করার সময় ব্যবহৃত settings
export const PDF_SETTINGS = {
  PAGE_WIDTH: 210, // A4 width in mm
  PAGE_HEIGHT: 297, // A4 height in mm
  MARGIN: 20, // Default margin in mm
  BASE_FONT_SIZE: 16, // Default font size in px
  DPI: 300, // Export quality
};

// ==================== Validation Rules ====================
// Form validation এর জন্য rules
export const VALIDATION = {
  MAX_SUB_QUESTIONS: 4, // সর্বোচ্চ উপপ্রশ্ন সংখ্যা
  MIN_MARKS: 1, // সর্বনিম্ন নম্বর
  MAX_MARKS: 100, // সর্বোচ্চ নম্বর
  MAX_TABLE_ROWS: 10, // টেবিলের সর্বোচ্চ সারি
  MAX_TABLE_COLS: 10, // টেবিলের সর্বোচ্চ কলাম
  MAX_BLANK_LINES: 10, // উত্তর লেখার জন্য সর্বোচ্চ ফাঁকা লাইন
};

// ==================== Helper Functions ====================
/**
 * Exam type কে বাংলায় convert করে
 * @param {string} type - Exam type value
 * @returns {string} - Bangla label
 */
export const getExamTypeBangla = (type) => {
  const examType = EXAM_TYPES.find(e => e.value === type);
  return examType ? examType.label : type;
};

/**
 * Subject কে বাংলায় convert করে
 * @param {string} subject - Subject value
 * @returns {string} - Bangla label
 */
export const getSubjectBangla = (subject) => {
  const subjectItem = SUBJECTS.find(s => s.value === subject);
  return subjectItem ? subjectItem.label : subject;
};

/**
 * Class কে বাংলায় convert করে
 * @param {string} classValue - Class value
 * @returns {string} - Bangla label
 */
export const getClassBangla = (classValue) => {
  const classItem = CLASS_LIST.find(c => c.value === classValue);
  return classItem ? classItem.label : `${classValue} শ্রেণি`;
};