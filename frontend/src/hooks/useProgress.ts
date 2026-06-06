import { useCallback, useEffect, useState } from 'react';
import type { LectureProgress, SectionProgress } from '../types/lesson';

const STORAGE_KEY = 'lms:progress';

function getAll(): Record<string, LectureProgress> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
}

function progressKey(courseSlug: string, lectureNumber: number) {
  return `${courseSlug}:${lectureNumber}`;
}

function defaultProgress(courseSlug: string, lectureNumber: number): LectureProgress {
  return {
    courseSlug,
    lectureNumber,
    sections: {},
    quizScore: null,
    quizCompleted: false,
    problemsCompleted: [],
    lectureCompleted: false,
    lastSection: 'overview',
  };
}

export function useProgress(courseSlug: string | undefined, lectureNumber: number | undefined) {
  const key = courseSlug && lectureNumber !== undefined ? progressKey(courseSlug, lectureNumber) : null;

  const [progress, setProgress] = useState<LectureProgress>(() => {
    if (!key || !courseSlug || lectureNumber === undefined) return defaultProgress('', 0);
    const all = getAll();
    return all[key] ?? defaultProgress(courseSlug, lectureNumber);
  });

  // Persist on change
  useEffect(() => {
    if (!key) return;
    const all = getAll();
    all[key] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }, [progress, key]);

  const markSectionVisited = useCallback((sectionId: string) => {
    setProgress(prev => {
      const existing: SectionProgress = prev.sections[sectionId] ?? {
        visited: false,
        practiceAttempted: false,
        practiceCompleted: false,
      };
      return {
        ...prev,
        lastSection: sectionId,
        sections: { ...prev.sections, [sectionId]: { ...existing, visited: true } },
      };
    });
  }, []);

  const markPracticeAttempted = useCallback((sectionId: string) => {
    setProgress(prev => {
      const existing: SectionProgress = prev.sections[sectionId] ?? {
        visited: true,
        practiceAttempted: false,
        practiceCompleted: false,
      };
      return {
        ...prev,
        sections: { ...prev.sections, [sectionId]: { ...existing, practiceAttempted: true } },
      };
    });
  }, []);

  const markPracticeCompleted = useCallback((sectionId: string) => {
    setProgress(prev => {
      const existing: SectionProgress = prev.sections[sectionId] ?? {
        visited: true,
        practiceAttempted: true,
        practiceCompleted: false,
      };
      return {
        ...prev,
        sections: { ...prev.sections, [sectionId]: { ...existing, practiceCompleted: true } },
      };
    });
  }, []);

  const markQuizCompleted = useCallback((score: number) => {
    setProgress(prev => ({ ...prev, quizScore: score, quizCompleted: true }));
  }, []);

  const markProblemCompleted = useCallback((problemId: string) => {
    setProgress(prev => {
      if (prev.problemsCompleted.includes(problemId)) return prev;
      return { ...prev, problemsCompleted: [...prev.problemsCompleted, problemId] };
    });
  }, []);

  const markLectureCompleted = useCallback(() => {
    setProgress(prev => ({ ...prev, lectureCompleted: true }));
  }, []);

  // Computed helpers
  const visitedSections = Object.values(progress.sections).filter(s => s.visited).length;
  const completedPractices = Object.values(progress.sections).filter(s => s.practiceCompleted).length;

  return {
    progress,
    visitedSections,
    completedPractices,
    markSectionVisited,
    markPracticeAttempted,
    markPracticeCompleted,
    markQuizCompleted,
    markProblemCompleted,
    markLectureCompleted,
  };
}

// Utility to get progress for a course's lectures (used in CoursePage)
export function getCourseProgress(courseSlug: string): Record<number, LectureProgress> {
  const all = getAll();
  const result: Record<number, LectureProgress> = {};
  for (const [k, v] of Object.entries(all)) {
    if (k.startsWith(`${courseSlug}:`)) {
      result[v.lectureNumber] = v;
    }
  }
  return result;
}
