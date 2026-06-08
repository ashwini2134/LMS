import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LectureProgress, SectionProgress } from '../types/lesson';

const STORAGE_KEY = 'lms:progress';
const PROGRESS_CHANGE_EVENT = 'lms:progress-change';

// ── Module-level version counter for stable snapshot references ─────────────
let _storeVersion = 0;

function readAll(): Record<string, LectureProgress> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
}

function writeAll(data: Record<string, LectureProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  _storeVersion++;
  window.dispatchEvent(new CustomEvent(PROGRESS_CHANGE_EVENT));
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
    handsOnTaskCompleted: false,
    lectureCompleted: false,
    lastSection: 'overview',
  };
}

// ── Snapshot cache: returns stable references when store hasn't changed ──────
const _snapCache: Map<string, { version: number; value: LectureProgress | null }> = new Map();

function readSnapshot(key: string | null): LectureProgress | null {
  if (!key) return null;
  const cached = _snapCache.get(key);
  if (cached && cached.version === _storeVersion) return cached.value;
  const all = readAll();
  const value = all[key] ?? null;
  _snapCache.set(key, { version: _storeVersion, value });
  return value;
}

function invalidateSnapshotCache() {
  _snapCache.clear();
}

// ── useProgress hook ─────────────────────────────────────────────────────────
export function useProgress(courseSlug: string | undefined, lectureNumber: number | undefined) {
  const key = courseSlug && lectureNumber !== undefined ? progressKey(courseSlug, lectureNumber) : null;
  const [version, setVersion] = useState(0);

  // Subscribe to progress changes — re-render only when store version changes
  useEffect(() => {
    const onChange = () => setVersion(v => v + 1);
    window.addEventListener('storage', onChange);
    window.addEventListener(PROGRESS_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener(PROGRESS_CHANGE_EVENT, onChange);
    };
  }, []);

  // Read current snapshot (stable reference when store unchanged)
  const snapshot = useMemo(() => readSnapshot(key), [key, version]);

  const progress: LectureProgress = snapshot ?? (courseSlug && lectureNumber !== undefined
    ? defaultProgress(courseSlug, lectureNumber)
    : defaultProgress('', 0));

  // Stable mutation helper
  const updateProgress = useCallback((updater: (prev: LectureProgress) => LectureProgress) => {
    if (!key) return;
    const all = readAll();
    const prev = all[key] ?? defaultProgress(courseSlug ?? '', lectureNumber ?? 0);
    const next = updater(prev);
    // Skip write if nothing changed
    if (next === prev) return;
    all[key] = next;
    writeAll(all);
  }, [key, courseSlug, lectureNumber]);

  const markSectionVisited = useCallback((sectionId: string) => {
    updateProgress(prev => {
      const existing: SectionProgress = prev.sections[sectionId] ?? {
        visited: false, practiceAttempted: false, practiceCompleted: false,
      };
      return {
        ...prev,
        lastSection: sectionId,
        sections: { ...prev.sections, [sectionId]: { ...existing, visited: true } },
      };
    });
  }, [updateProgress]);

  const markPracticeAttempted = useCallback((sectionId: string) => {
    updateProgress(prev => {
      const existing: SectionProgress = prev.sections[sectionId] ?? {
        visited: true, practiceAttempted: false, practiceCompleted: false,
      };
      return {
        ...prev,
        sections: { ...prev.sections, [sectionId]: { ...existing, practiceAttempted: true } },
      };
    });
  }, [updateProgress]);

  const markPracticeCompleted = useCallback((sectionId: string) => {
    updateProgress(prev => {
      const existing: SectionProgress = prev.sections[sectionId] ?? {
        visited: true, practiceAttempted: true, practiceCompleted: false,
      };
      return {
        ...prev,
        sections: { ...prev.sections, [sectionId]: { ...existing, practiceCompleted: true } },
      };
    });
  }, [updateProgress]);

  const markQuizCompleted = useCallback((score: number) => {
    updateProgress(prev => ({ ...prev, quizScore: score, quizCompleted: true }));
  }, [updateProgress]);

  const markProblemCompleted = useCallback((problemId: string) => {
    updateProgress(prev => {
      if (prev.problemsCompleted.includes(problemId)) return prev;
      return { ...prev, problemsCompleted: [...prev.problemsCompleted, problemId] };
    });
  }, [updateProgress]);

  const markHandsOnTaskCompleted = useCallback(() => {
    updateProgress(prev => ({ ...prev, handsOnTaskCompleted: true }));
  }, [updateProgress]);

  const markLectureCompleted = useCallback(() => {
    updateProgress(prev => ({ ...prev, lectureCompleted: true }));
  }, [updateProgress]);

  const visitedSections = useMemo(
    () => Object.values(progress.sections).filter(s => s.visited).length,
    [progress.sections],
  );

  const completedPractices = useMemo(
    () => Object.values(progress.sections).filter(s => s.practiceCompleted).length,
    [progress.sections],
  );

  return {
    progress,
    visitedSections,
    completedPractices,
    markSectionVisited,
    markPracticeAttempted,
    markPracticeCompleted,
    markQuizCompleted,
    markProblemCompleted,
    markHandsOnTaskCompleted,
    markLectureCompleted,
  };
}

// ── Utility: get progress for a course's lectures ────────────────────────────
export function getCourseProgress(courseSlug: string): Record<number, LectureProgress> {
  const all = readAll();
  const result: Record<number, LectureProgress> = {};
  for (const [k, v] of Object.entries(all)) {
    if (k.startsWith(`${courseSlug}:`)) {
      result[v.lectureNumber] = v;
    }
  }
  return result;
}

// ── Course stats ─────────────────────────────────────────────────────────────
export interface CourseStats {
  lecturesStarted: number;
  lecturesCompleted: number;
  quizzesPassed: number;
  handsOnTasksCompleted: number;
  totalLectures: number;
}

export function getCourseStats(courseSlug: string, totalLectures: number): CourseStats {
  const progress = getCourseProgress(courseSlug);
  let lecturesStarted = 0;
  let lecturesCompleted = 0;
  let quizzesPassed = 0;
  let handsOnTasksCompleted = 0;

  for (let n = 0; n < totalLectures; n++) {
    const p = progress[n];
    if (p) {
      const hasAnyActivity = p.lectureCompleted || p.quizCompleted ||
        p.handsOnTaskCompleted || Object.keys(p.sections).length > 0;
      if (hasAnyActivity) lecturesStarted++;
      if (p.lectureCompleted) lecturesCompleted++;
      if (p.quizCompleted) quizzesPassed++;
      if (p.handsOnTaskCompleted) handsOnTasksCompleted++;
    }
  }

  return { lecturesStarted, lecturesCompleted, quizzesPassed, handsOnTasksCompleted, totalLectures };
}

// ── Sequential unlocking ─────────────────────────────────────────────────────
export function isLectureUnlocked(
  lectureNumber: number,
  courseProgress: Record<number, LectureProgress>,
): boolean {
  if (lectureNumber === 0) return true;
  const prev = courseProgress[lectureNumber - 1];
  if (!prev) return false;
  const theoryViewed = Object.keys(prev.sections).length > 0;
  return theoryViewed && prev.quizCompleted && prev.handsOnTaskCompleted;
}

// ── Subscribe to progress changes (external components) ─────────────────────
export function subscribeToProgressChanges(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(PROGRESS_CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(PROGRESS_CHANGE_EVENT, cb);
  };
}

// ── Get all progress ─────────────────────────────────────────────────────────
export function getAllProgress(): Record<string, LectureProgress> {
  return readAll();
}
