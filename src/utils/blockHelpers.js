/**
 * =====================================================
 * Block Helper Functions
 * =====================================================
 * এই ফাইলে block related helper functions আছে
 * Block এর default content, validation, etc.
 */

/**
 * নতুন block তৈরি করার সময় default content return করে
 * @param {string} type - Block type (text, formula, table, etc.)
 * @returns {Object} - Default content object
 */
export const getDefaultBlockContent = (type) => {
  switch (type) {
    case 'text':
      // টেক্সট block এর default content
      return { text: '' };
      
    case 'formula':
      // ফর্মুলা block এর default content (LaTeX)
      return { latex: '' };
      
    case 'image':
      // ছবি block এর default content
      return { url: '' };
      
    case 'table':
      // টেবিল block এর default content (sample data সহ)
      return {
        rows: 2, // সারি সংখ্যা
        cols: 2, // কলাম সংখ্যা
        headers: ['হেডার ১', 'হেডার ২'], // Header row
        data: [
          ['ঘর ১', 'ঘর ২'], // Row 1
          ['ঘর ৩', 'ঘর ৪']  // Row 2
        ]
      };
      
    case 'diagram':
      // চিত্র/ডায়াগ্রাম block এর default content
      return { description: '' };
      
    case 'list':
      // তালিকা block এর default content
      return { items: [] };
      
    case 'blank':
      // ফাঁকা স্থান block এর default content (উত্তর লেখার জন্য)
      return { lines: 1 };
      
    default:
      return {};
  }
};

/**
 * Block content validate করে (সব required fields আছে কিনা check করে)
 * @param {string} type - Block type
 * @param {Object} content - Block content
 * @returns {boolean} - Valid হলে true, না হলে false
 */
export const validateBlockContent = (type, content) => {
  if (!content) return false;
  
  switch (type) {
    case 'text':
      return typeof content.text === 'string';
      
    case 'formula':
      return typeof content.latex === 'string';
      
    case 'image':
      return typeof content.url === 'string';
      
    case 'table':
      return (
        typeof content.rows === 'number' &&
        typeof content.cols === 'number' &&
        Array.isArray(content.headers) &&
        Array.isArray(content.data)
      );
      
    case 'diagram':
      return typeof content.description === 'string';
      
    case 'list':
      return Array.isArray(content.items);
      
    case 'blank':
      return typeof content.lines === 'number';
      
    default:
      return true;
  }
};

/**
 * Block এ কোনো content আছে কিনা check করে (empty check)
 * @param {string} type - Block type
 * @param {Object} content - Block content
 * @returns {boolean} - Content থাকলে true, empty হলে false
 */
export const hasBlockContent = (type, content) => {
  if (!content) return false;
  
  switch (type) {
    case 'text':
      return content.text && content.text.trim().length > 0;
      
    case 'formula':
      return content.latex && content.latex.trim().length > 0;
      
    case 'image':
      return content.url && content.url.trim().length > 0;
      
    case 'table':
      // Table এ কোনো data আছে কিনা check করে
      if (!content.data || !Array.isArray(content.data)) return false;
      return content.data.some(row => 
        Array.isArray(row) && row.some(cell => cell && cell.trim().length > 0)
      );
      
    case 'diagram':
      return content.description && content.description.trim().length > 0;
      
    case 'list':
      return content.items && content.items.length > 0 && 
             content.items.some(item => item && item.trim().length > 0);
      
    case 'blank':
      return content.lines && content.lines > 0;
      
    default:
      return false;
  }
};
