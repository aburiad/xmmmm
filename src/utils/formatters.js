/**
 * =====================================================
 * Formatting Helper Functions
 * =====================================================
 * এই ফাইলে date, time, number format করার functions আছে
 */

/**
 * ISO date string কে readable Bangla format এ convert করে
 * @param {string} isoString - ISO format date string (e.g., "2024-01-15T10:30:00.000Z")
 * @returns {string} - Formatted date string (e.g., "১৫ জানুয়ারি, ২০২৪")
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    
    // Bangla months
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    
    // English to Bangla digit conversion
    const toBanglaDigit = (num) => {
      const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return num.toString().split('').map(d => banglaDigits[parseInt(d)]).join('');
    };
    
    const day = toBanglaDigit(date.getDate());
    const month = months[date.getMonth()];
    const year = toBanglaDigit(date.getFullYear());
    
    return `${day} ${month}, ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString;
  }
};

/**
 * Relative time দেখায় (e.g., "২ দিন আগে")
 * @param {string} isoString - ISO format date string
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // English to Bangla digit conversion
    const toBanglaDigit = (num) => {
      const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return num.toString().split('').map(d => banglaDigits[parseInt(d)]).join('');
    };
    
    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${toBanglaDigit(diffMins)} মিনিট আগে`;
    if (diffHours < 24) return `${toBanglaDigit(diffHours)} ঘণ্টা আগে`;
    if (diffDays < 7) return `${toBanglaDigit(diffDays)} দিন আগে`;
    
    return formatDate(isoString);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return isoString;
  }
};

/**
 * English number কে Bangla number এ convert করে
 * @param {number|string} num - English number
 * @returns {string} - Bangla number string
 */
export const toBanglaNumber = (num) => {
  if (num === null || num === undefined) return '';
  
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => {
    return isNaN(d) ? d : banglaDigits[parseInt(d)];
  }).join('');
};
