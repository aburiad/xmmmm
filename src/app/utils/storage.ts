import { QuestionPaper } from '../types';

const STORAGE_KEY = 'bd-board-question-papers';

export const savePapers = (papers: QuestionPaper[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
};

export const loadPapers = (): QuestionPaper[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  const papers = data ? JSON.parse(data) : [];
  
  // Debug: Log table blocks when loading
  papers.forEach((paper: QuestionPaper, pidx: number) => {
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
};

export const savePaper = (paper: QuestionPaper) => {
  const papers = loadPapers();
  const index = papers.findIndex(p => p.id === paper.id);
  
  // Debug: Log table blocks before saving
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
  
  if (index >= 0) {
    papers[index] = paper;
  } else {
    papers.push(paper);
  }
  
  savePapers(papers);
};

export const deletePaper = (id: string) => {
  const papers = loadPapers();
  savePapers(papers.filter(p => p.id !== id));
};

export const duplicatePaper = (id: string): QuestionPaper | null => {
  const papers = loadPapers();
  const paper = papers.find(p => p.id === id);
  
  if (!paper) return null;
  
  const newPaper: QuestionPaper = {
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
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getAllPapers = (): QuestionPaper[] => {
  return loadPapers();
};

export const clearAllPapers = () => {
  localStorage.removeItem(STORAGE_KEY);
};