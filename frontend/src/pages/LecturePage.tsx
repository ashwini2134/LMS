import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useLessonData } from '../hooks/useLessonData';
import { useProgress } from '../hooks/useProgress';
import {
  LessonSidebar,
  LessonSection,
  QuizEngine,
  ProblemCard,
  SummaryCard,
} from '../components/lesson';
import type { CodingProblem } from '../types/lesson';

// ── Fallback legacy renderer (notes.md) ──────────────────────────────────────

function LegacyLecturePage({ slug, lectureNumber }: { slug: string; lectureNumber: number }) {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const courseTitle = slug === 'cs50p' ? 'CS50 Python' : slug === 'cs50ai' ? 'CS50 AI' : slug.toUpperCase();

  useEffect(() => {
    const base = import.meta.env.BASE_URL ?? '/';
    const url = base.replace(/\/$/, '') + `/data/${slug}/lecture_${lectureNumber}/notes.md`;
    fetch(url).then(r => r.ok ? r.text() : '').then(setContent).catch(() => {});
  }, [slug, lectureNumber]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-slate-700/20 px-6 py-3 bg-slate-900/40">
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300">Dashboard</button>
          <span className="text-slate-600">/</span>
          <button onClick={() => navigate(`/course/${slug}`)} className="text-blue-400 hover:text-blue-300">{courseTitle}</button>
          <span className="text-slate-600">/</span>
          <span className="text-white">Lecture {lectureNumber}</span>
        </nav>
        <div className="flex items-center gap-2">
          {lectureNumber > 0 && (
            <button onClick={() => navigate(`/course/${slug}/lecture/${lectureNumber - 1}`)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <button onClick={() => navigate(`/course/${slug}/lecture/${lectureNumber + 1}`)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="p-6 max-w-3xl mx-auto">
        <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{content || 'Loading lecture content…'}</pre>
      </div>
    </div>
  );
}

// ── Main data-driven LecturePage ──────────────────────────────────────────────

export default function LecturePage() {
  const { slug, number } = useParams<{ slug: string; number: string }>();
  const navigate = useNavigate();
  const lectureNumber = Number(number ?? 0);

  const { lessonData, loading, error } = useLessonData(slug, lectureNumber);
  const {
    progress,
    markSectionVisited,
    markPracticeAttempted,
    markPracticeCompleted,
    markQuizCompleted,
    markProblemCompleted,
    markLectureCompleted,
  } = useProgress(slug, lectureNumber);

  const [activeSection, setActiveSection] = useState('overview');
  const [allLectures, setAllLectures] = useState<Array<{ number: number; title: string }>>([]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Load lecture list for prev/next navigation
  useEffect(() => {
    if (!slug) return;
    api.courseLectures(slug).then(lectures => {
      setAllLectures(lectures.map(l => ({ number: l.number, title: l.title })));
    }).catch(() => {});
  }, [slug]);

  // IntersectionObserver to track active section
  useEffect(() => {
    const refs = sectionRefs.current;
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const id = entry.target.id.replace('section-', '');
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setActiveSection(id);
            markSectionVisited(id);
          }
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6] }
    );
    for (const el of Object.values(refs)) {
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonData]);

  const setSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!slug) return null;

  // Fallback to legacy renderer if no lesson.json
  if (!loading && (error === 'no-lesson-json' || (!lessonData && error))) {
    return <LegacyLecturePage slug={slug} lectureNumber={lectureNumber} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="h-7 w-7 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!lessonData) return null;

  const prevLecture = allLectures.find(l => l.number === lectureNumber - 1);
  const nextLecture = allLectures.find(l => l.number === lectureNumber + 1);
  const courseTitle = slug === 'cs50p' ? 'CS50 Python' : slug === 'cs50ai' ? 'CS50 AI' : slug.toUpperCase();

  const quiz = lessonData.quiz ?? [];
  const problems: CodingProblem[] = lessonData.problems ?? [];
  const summary = lessonData.summary;

  return (
    <div className="w-full flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* ── Top Nav Bar ── */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-700/20 px-6 py-3 bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {prevLecture && (
            <button
              onClick={() => navigate(`/course/${slug}/lecture/${prevLecture.number}`)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
              title={`Previous: ${prevLecture.title}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <nav className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300 transition-colors">Dashboard</button>
            <span className="text-slate-600">/</span>
            <button onClick={() => navigate(`/course/${slug}`)} className="text-blue-400 hover:text-blue-300 transition-colors">{courseTitle}</button>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">{lessonData.title}</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white hidden sm:block">{lessonData.title}</span>
          <span className="text-[11px] text-slate-400 hidden sm:block">Week {lectureNumber} · {lessonData.estimatedMinutes} min</span>
          {nextLecture && (
            <button
              onClick={() => navigate(`/course/${slug}/lecture/${nextLecture.number}`)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
              title={`Next: ${nextLecture.title}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <LessonSidebar
          sections={lessonData.sections}
          hasQuiz={quiz.length > 0}
          hasProblems={problems.length > 0}
          hasSummary={!!summary}
          activeSection={activeSection}
          progress={progress}
          onNavigate={scrollToSection}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto space-y-12">

            {/* ── Data-driven sections ── */}
            {lessonData.sections.map((section, i) => (
              <LessonSection
                key={section.id}
                section={section}
                index={i}
                innerRef={setSectionRef(section.id)}
                onPracticeAttempt={() => markPracticeAttempted(section.id)}
                onPracticeComplete={() => markPracticeCompleted(section.id)}
              />
            ))}

            {/* ── Quiz Section ── */}
            {quiz.length > 0 && (
              <section
                id="section-quiz"
                ref={setSectionRef('quiz') as any}
              >
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center text-sm font-bold text-blue-400">
                      {lessonData.sections.length + 1}
                    </span>
                    Quiz
                  </h2>
                  {progress.quizCompleted && (
                    <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 border border-green-700/30 rounded-xl px-4 py-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Quiz completed — Score: {progress.quizScore}/{quiz.length}
                    </div>
                  )}
                  <QuizEngine
                    questions={quiz}
                    onComplete={(score, total) => {
                      markQuizCompleted(score);
                      if (score / total >= 0.7) markSectionVisited('quiz');
                    }}
                  />
                </div>
              </section>
            )}

            {/* ── Problems Section ── */}
            {problems.length > 0 && (
              <section
                id="section-problems"
                ref={setSectionRef('problems') as any}
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-orange-600/20 flex items-center justify-center text-sm font-bold text-orange-400">
                      {lessonData.sections.length + (quiz.length > 0 ? 2 : 1)}
                    </span>
                    Problems to Solve
                  </h2>
                  <p className="text-sm text-slate-400">
                    Apply what you've learned by solving these coding challenges.
                    {progress.problemsCompleted.length > 0 && (
                      <span className="ml-2 text-orange-400 font-medium">
                        {progress.problemsCompleted.length}/{problems.length} solved
                      </span>
                    )}
                  </p>
                  <div className="space-y-3">
                    {problems.map((problem, i) => (
                      <ProblemCard
                        key={problem.id}
                        problem={problem}
                        index={i}
                        completed={progress.problemsCompleted.includes(problem.id)}
                        onComplete={(id) => {
                          markProblemCompleted(id);
                          markSectionVisited('problems');
                        }}
                      />
                    ))}
                  </div>

                  {/* Link to full project page for detailed problems */}
                  <div className="pt-2">
                    <button
                      onClick={() => navigate(`/course/${slug}/lecture/${lectureNumber}/project`)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      Open Full Problem Set
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ── Summary Section ── */}
            {summary && (
              <section
                id="section-summary"
                ref={setSectionRef('summary') as any}
              >
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-green-600/20 flex items-center justify-center text-sm font-bold text-green-400">
                      {lessonData.sections.length + (quiz.length > 0 ? 1 : 0) + (problems.length > 0 ? 1 : 0) + 1}
                    </span>
                    Summary
                  </h2>
                  <SummaryCard
                    summary={summary}
                    lectureTitle={lessonData.title}
                    nextLectureTitle={nextLecture?.title}
                    onNext={() => {
                      markLectureCompleted();
                      if (nextLecture) navigate(`/course/${slug}/lecture/${nextLecture.number}`);
                    }}
                  />
                </div>
              </section>
            )}

            <div className="h-16" />
          </div>
        </main>
      </div>
    </div>
  );
}
