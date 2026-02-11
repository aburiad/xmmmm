/**
 * =====================================================
 * LocalStorage Helper Functions
 * =====================================================
 * এই ফাইলে localStorage এর সাথে কাজ করার সব functions আছে
 * Question papers save, load, delete, duplicate করা হয়
 */

import { STORAGE_KEYS } from '../config/constants';

/**
 * সব question papers save করে localStorage এ
 * @param {Array} papers - Question papers এর array
 */
export const savePapers = (papers) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
  } catch (error) {
    console.error('Error saving papers:', error);
  }
};

/**
 * localStorage থেকে সব question papers load করে
 * @returns {Array} - Question papers এর array
 */
export const loadPapers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PAPERS);
    const papers = data ? JSON.parse(data) : [];
    
    // Debug: Table blocks check করা (development এর জন্য)
    papers.forEach((paper, pidx) => {
      paper.questions.forEach((q, qidx) => {
        q.blocks.forEach((b, bidx) => {
          if (b.type === 'table') {
            console.log(`📥 Loaded Table from Paper${pidx + 1} Q${qidx + 1} Block${bidx + 1}:`, {
              rows: b.content.rows,
              cols: b.content.cols,
              headers: b.content.headers,
              data: b.content.data
            });
          }
        });
      });
    });
    
    return papers;
  } catch (error) {
    console.error('Error loading papers:', error);
    return [];
  }
};

/**
 * একটি specific question paper save/update করে
 * @param {Object} paper - Question paper object
 */
export const savePaper = (paper) => {
  try {
    const papers = loadPapers();
    const index = papers.findIndex(p => p.id === paper.id);
    
    // Debug: Table blocks check করা save করার আগে
    paper.questions.forEach((q, idx) => {
      q.blocks.forEach((b, bidx) => {
        if (b.type === 'table') {
          console.log(`📊 Saving Table in Q${idx + 1} Block${bidx + 1}:`, {
            rows: b.content.rows,
            cols: b.content.cols,
            headers: b.content.headers,
            data: b.content.data
          });
        }
      });
    });
    
    // যদি paper already exist করে, update করো; না হলে নতুন add করো
    if (index >= 0) {
      papers[index] = paper;
    } else {
      papers.push(paper);
    }
    
    savePapers(papers);
  } catch (error) {
    console.error('Error saving paper:', error);
  }
};

/**
 * একটি question paper delete করে
 * @param {string} id - Paper এর ID
 */
export const deletePaper = (id) => {
  try {
    const papers = loadPapers();
    savePapers(papers.filter(p => p.id !== id));
  } catch (error) {
    console.error('Error deleting paper:', error);
  }
};

/**
 * একটি question paper duplicate/copy করে
 * @param {string} id - Original paper এর ID
 * @returns {Object|null} - নতুন duplicated paper অথবা null
 */
export const duplicatePaper = (id) => {
  try {
    const papers = loadPapers();
    const paper = papers.find(p => p.id === id);
    
    if (!paper) return null;
    
    // নতুন paper তৈরি করো original এর copy দিয়ে
    const newPaper = {
      ...paper,
      id: generateId(),
      setup: {
        ...paper.setup,
        schoolName: paper.setup.schoolName ? `${paper.setup.schoolName} (Copy)` : undefined,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    savePaper(newPaper);
    return newPaper;
  } catch (error) {
    console.error('Error duplicating paper:', error);
    return null;
  }
};

/**
 * Unique ID generate করে (timestamp + random string)
 * @returns {string} - Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
