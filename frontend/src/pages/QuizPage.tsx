import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveCompletedQuiz, getCompletedQuizzes, api } from "../api";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuizPage() {
  const { slug, number } = useParams<{ slug: string; number: string }>();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selected, setSelected] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allLectures, setAllLectures] = useState<any[]>([]);

  // Load Quiz Data
  useEffect(() => {
    async function loadQuiz() {
      const base = import.meta.env.BASE_URL;
      try {
        const response = await fetch(`${base}data/${slug}/lecture_${number}/quiz.json`);

        if (!response.ok) {
          setError("No quiz available for this lecture yet.");
          setQuestions([]);
          return;
        }

        const data = await response.json();
        setError(null);
        setQuestions(data);

        // Reset state on quiz/lecture parameter change
        setSelected({});
        setCurrentIndex(0);
        setSubmitted(false);

        // Check if quiz was previously completed and prefill
        const completed = getCompletedQuizzes();
        const quizKey = `${slug}_${number}`;
        if (completed[quizKey] !== undefined) {
          // Quiz was already completed. We can load answers or just show it as completed.
          // For demo, we let them retake it or show new status.
        }
      } catch {
        setError("No quiz available for this lecture yet.");
        setQuestions([]);
      }
    }

    loadQuiz();
  }, [slug, number]);

  // Load lectures list to find adjacent lectures
  useEffect(() => {
    if (slug) {
      api.courseLectures(slug)
        .then(setAllLectures)
        .catch(console.error);
    }
  }, [slug]);

  const courseTitle = slug === "cs50p" ? "CS50 Python" : slug === "cs50ai" ? "CS50 AI" : slug?.toUpperCase() || "Course";

  // Score Calculations
  const answeredCount = Object.keys(selected).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const correctCount = questions.filter((q, idx) => selected[idx] === q.answer).length;
  const scorePercentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = scorePercentage >= 80;

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (answeredCount < questions.length) {
      if (!window.confirm(`You have only answered ${answeredCount} out of ${questions.length} questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    setSubmitted(true);
    if (slug && number) {
      saveCompletedQuiz(slug, Number(number), scorePercentage);
    }
  };

  // Reset Quiz State for Retake
  const handleRetakeQuiz = () => {
    setSelected({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  // Compile Topics Needing Review
  const getReviewTopics = () => {
    const topics = new Set<string>();
    questions.forEach((q, idx) => {
      if (selected[idx] !== q.answer) {
        const qText = q.question.toLowerCase();
        if (qText.includes("loop") || qText.includes("for") || qText.includes("while")) {
          topics.add("Loops & Iterations");
        } else if (qText.includes("comment") || qText.includes("#")) {
          topics.add("Comments & Documentation");
        } else if (qText.includes("print") || qText.includes("f-string") || qText.includes("format")) {
          topics.add("Console Output & Strings");
        } else if (qText.includes("input")) {
          topics.add("User Inputs");
        } else if (qText.includes("if") || qText.includes("elif") || qText.includes("condition")) {
          topics.add("Conditional Logic");
        } else if (qText.includes("function") || qText.includes("def")) {
          topics.add("Functions & Arguments");
        } else if (qText.includes("dict") || qText.includes("dictionary")) {
          topics.add("Dictionaries & Mappings");
        } else if (qText.includes("exception") || qText.includes("try")) {
          topics.add("Exception Handling");
        } else if (qText.includes("search") || qText.includes("bfs") || qText.includes("dfs")) {
          topics.add("Uninformed Search Algorithms");
        } else if (qText.includes("heuristic") || qText.includes("a*")) {
          topics.add("Heuristics & A* Search");
        } else if (qText.includes("bayes") || qText.includes("probability")) {
          topics.add("Probability & Bayes Theorem");
        } else {
          topics.add("Core Lecture Concepts");
        }
      }
    });
    return Array.from(topics);
  };

  // Dynamic Learning Note Generator
  const getLearningNote = (questionText: string) => {
    const qLower = questionText.toLowerCase();
    if (slug === "cs50p") {
      if (qLower.includes("loop") || qLower.includes("for") || qLower.includes("while")) {
        return "💡 Python Pro-Tip: Use list comprehensions for simple transformations. For example, `[x**2 for x in numbers]` is faster and more Pythonic than standard appends inside a for loop.";
      }
      if (qLower.includes("comment") || qLower.includes("#")) {
        return "💡 Python Pro-Tip: Comments should explain *why* the code is written, not *what* it does. Clean, descriptive variable and function names reduce the need for comments.";
      }
      if (qLower.includes("f-string") || qLower.includes("print") || qLower.includes("format")) {
        return "💡 Python Pro-Tip: F-strings support not only variables but expressions, functions, and format specs: `print(f\"{price:.2f}\")` rounds floats to two decimals instantly.";
      }
      if (qLower.includes("if") || qLower.includes("elif") || qLower.includes("condition")) {
        return "💡 Python Pro-Tip: Leverage Python's 'truthiness' - empty containers like `[]`, `{}`, and strings `\"\"` evaluate as False naturally. No need for `if len(items) == 0`.";
      }
      if (qLower.includes("function") || qLower.includes("def")) {
        return "💡 Python Pro-Tip: Default arguments in functions are evaluated only once when the function is defined. Never use mutable defaults like `def append_to(item, list=[])`.";
      }
      if (qLower.includes("dict") || qLower.includes("dictionary")) {
        return "💡 Python Pro-Tip: Dictionaries in Python 3.7+ maintain insertion order. Use `.get(key, default)` to query keys safely without triggering KeyError exceptions.";
      }
      if (qLower.includes("exception") || qLower.includes("try") || qLower.includes("except")) {
        return "💡 Python Pro-Tip: Always specify explicit exception types (e.g. `except ValueError`) rather than a bare `except:` to avoid capturing unexpected system errors.";
      }
      return "💡 Python Pro-Tip: Write clean code following PEP 8 style guides (use snake_case for functions and variables, and keep line lengths under 79 characters).";
    }
    
    if (slug === "cs50ai") {
      if (qLower.includes("search") || qLower.includes("bfs") || qLower.includes("dfs")) {
        return "💡 AI Pro-Tip: Breadth-First Search (BFS) is optimal and guarantees finding the shallowest goal state. Depth-First Search (DFS) is not optimal but is memory efficient.";
      }
      if (qLower.includes("heuristic") || qLower.includes("a*") || qLower.includes("astar")) {
        return "💡 AI Pro-Tip: A* search is optimal if the heuristic is admissible (never overestimates the true cost) and consistent (satisfies the triangle inequality).";
      }
      if (qLower.includes("minimax") || qLower.includes("alpha-beta") || qLower.includes("game")) {
        return "💡 AI Pro-Tip: Alpha-beta pruning drastically reduces search spaces by skipping branches that are guaranteed to be worse than previously evaluated choices.";
      }
      if (qLower.includes("probability") || qLower.includes("bayes") || qLower.includes("bayes'")) {
        return "💡 AI Pro-Tip: Naive Bayes classifiers assume features are conditionally independent. Despite this 'naive' assumption, they perform remarkably well for text classification.";
      }
      if (qLower.includes("neural") || qLower.includes("network") || qLower.includes("epoch")) {
        return "💡 AI Pro-Tip: Overfitting occurs when a neural network memorizes training data. Mitigate this using dropout layers, early stopping, or L1/L2 regularization.";
      }
      return "💡 AI Pro-Tip: Socratic learning is key in artificial intelligence. Break down complex algorithms into mathematical inputs, agent states, actions, and transition costs.";
    }
    
    return "💡 Learning Tip: Take frequent, short breaks when studying coding concepts. Retaining complex structures is much easier when spaced over consecutive study blocks.";
  };

  // Find next lecture parameters
  const currentLectureNum = Number(number);
  const nextLecture = allLectures.find((l) => l.number === currentLectureNum + 1);

  if (error) {
    return (
      <div className="min-h-screen bg-[#080c14] px-4 md:px-8 py-10 text-white flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0d111a] border border-slate-800 rounded-3xl p-8 text-center shadow-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-slate-100">Quiz Unavailable</h2>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <Link
            to={`/course/${slug}/lecture/${number}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            ← Return to Lecture Notes
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm">Loading quiz content...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selected[currentIndex];
  const reviewTopics = getReviewTopics();

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-150 flex flex-col">
      
      {/* 1. QUIZ HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20 border-b border-slate-800 px-6 py-6 md:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] tracking-wider uppercase font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              {courseTitle}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Lecture {number} Quiz
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">🕒 Estimated Time: {questions.length * 2} min</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">📋 Questions: {questions.length}</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">🎯 Passing Score: 80%</span>
            </div>
          </div>

          {/* Real-time Progress Bar */}
          <div className="w-full md:w-80 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">
                {submitted ? "Grading Complete" : `Progress: ${answeredCount} of ${questions.length} answered`}
              </span>
              <span className="text-slate-200">{submitted ? `${scorePercentage}%` : `${progressPercent}%`}</span>
            </div>
            <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  submitted
                    ? isPassed
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500"
                }`}
                style={{ width: `${submitted ? scorePercentage : progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ WORKSPACE */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        
        {/* Render Results Dashboard if submitted */}
        {submitted ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 6. QUIZ RESULTS PAGE HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Radial Score Card */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1.5 ${isPassed ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Quiz Score</span>
                <div className={`text-5xl font-black mb-1.5 ${isPassed ? "text-green-400" : "text-red-400"}`}>
                  {scorePercentage}%
                </div>
                <div className="text-xs text-slate-300 font-semibold mb-3">
                  ({correctCount} of {questions.length} Correct)
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isPassed
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {isPassed ? "PASSED" : "FAILED"}
                </span>
              </div>

              {/* Feedback Summary Card */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-center shadow-lg md:col-span-2">
                <h3 className="text-lg font-extrabold text-white mb-2">
                  {isPassed ? "🎉 Congratulations!" : "⚠️ Try Again to Pass"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {isPassed
                    ? `Great job! You have demonstrated high proficiency in the core concepts of Lecture ${number}. You can now proceed to review solution scripts or continue to the next lecture.`
                    : `You scored ${scorePercentage}%, which is below the 80% passing mark. Review the explanations below, revisit the lecture notes, and try again.`}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleRetakeQuiz}
                    className="px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                  <Link
                    to={`/course/${slug}/lecture/${number}`}
                    className="px-4.5 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Review Notes
                  </Link>
                  {nextLecture && isPassed && (
                    <Link
                      to={`/course/${slug}/lecture/${nextLecture.number}`}
                      className="px-4.5 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                    >
                      Next Lecture →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnostics topics needing improvement */}
            <div className="bg-[#0c1015]/40 border border-slate-800/80 rounded-3xl p-6 shadow-lg">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>📊</span> Topic Proficiency Diagnostics
              </h3>
              {reviewTopics.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/25 rounded-2xl">
                  <span className="text-lg">🏅</span>
                  <p className="text-xs text-green-300 font-semibold">Perfect diagnostics! You cleared all quiz elements with 100% precision. Zero revision areas identified.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">Based on your missed responses, we recommend revising the following programming topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {reviewTopics.map((topic) => (
                      <span key={topic} className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full">
                        ⚠️ {topic}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-2">
                    <span>💡</span> Tip: You can query Fraylon Mentor chatbot on the coding project pages for progressive Socratic hints on these topics.
                  </div>
                </div>
              )}
            </div>

            {/* 5. POST-SUBMISSION DETAILED REVIEW PANEL */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>📝</span> Detailed Question Review
              </h3>
              
              {questions.map((q, idx) => {
                const selectedAnswer = selected[idx];
                const isCorrect = selectedAnswer === q.answer;
                const learningNote = getLearningNote(q.question);

                return (
                  <div
                    key={idx}
                    className={`border rounded-3xl p-6 md:p-8 bg-[#0c1017]/80 shadow-md ${
                      isCorrect ? "border-green-950/80" : "border-red-950/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-[11px] font-bold text-slate-500">Question {idx + 1} of {questions.length}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isCorrect
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-white mb-6 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {q.question}
                      </ReactMarkdown>
                    </h4>

                    {/* Options Review grid */}
                    <div className="space-y-3 mb-6">
                      {q.options.map((option, optIdx) => {
                        const letter = ["A", "B", "C", "D", "E"][optIdx] || "•";
                        const isOptionCorrect = option === q.answer;
                        const isOptionChosen = selectedAnswer === option;

                        let style = "border-slate-850 bg-slate-900/10 text-slate-500 opacity-60";
                        let letterStyle = "bg-slate-900/40 border-slate-850 text-slate-600";

                        if (isOptionCorrect) {
                          style = "border-green-500/80 bg-green-500/10 text-green-300 font-semibold";
                          letterStyle = "bg-green-500/20 border-green-500/30 text-green-400";
                        } else if (isOptionChosen) {
                          style = "border-red-500/80 bg-red-500/10 text-red-300 font-semibold";
                          letterStyle = "bg-red-500/20 border-red-500/30 text-red-400";
                        }

                        return (
                          <div
                            key={option}
                            className={`w-full rounded-2xl border p-4 text-xs md:text-sm flex items-center gap-4 ${style}`}
                          >
                            <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${letterStyle}`}>
                              {letter}
                            </span>
                            <span className="leading-relaxed">{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanations Section */}
                    <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed text-slate-350">
                      <div>
                        <span className="font-bold text-slate-200">Explanation: </span>
                        {q.explanation}
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-slate-400 italic">
                        {learningNote}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          
          /* IN-PROGRESS QUIZ EXPERIENCE */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* 2. QUESTION NAVIGATION PANEL (Left 25% width on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#0c1015]/40 border border-slate-800/80 rounded-3xl p-5 shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <span>🧭</span> Navigation
                  </h3>
                  
                  {/* Grid numbers */}
                  <div className="grid grid-cols-5 gap-2.5">
                    {questions.map((_, idx) => {
                      const isCurrent = currentIndex === idx;
                      const isAnswered = selected[idx] !== undefined;
                      
                      let style = "border-slate-800 text-slate-500 bg-transparent hover:border-slate-700";
                      
                      if (isCurrent) {
                        style = "border-blue-500 bg-blue-500/10 text-blue-400 font-black shadow-sm ring-1 ring-blue-500/30";
                      } else if (isAnswered) {
                        style = "bg-slate-800/85 border-slate-750 text-slate-200 font-bold";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs transition-all duration-150 cursor-pointer ${style}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-6 mt-8 space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-450">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-800 border border-slate-750 rounded-md"></span> Answered</span>
                    <span>{answeredCount} / {questions.length}</span>
                  </div>
                  
                  <button
                    onClick={handleSubmitQuiz}
                    className="w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* 3. ACTIVE QUESTION DISPLAY (Right 75% width on desktop) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Question Panel Card */}
              <div className="bg-[#0c1015]/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-md">
                
                {/* Real-time Question Info Header */}
                <div className="flex items-center justify-between gap-4 mb-5 border-b border-slate-800/60 pb-3">
                  <span className="text-[11px] font-bold text-slate-500">Question {currentIndex + 1} of {questions.length}</span>
                  {selectedAnswer && (
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded-md animate-pulse">
                      Selected
                    </span>
                  )}
                </div>

                {/* Question Prompt */}
                <h2 className="text-base md:text-lg font-bold text-white mb-6 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentQuestion.question}
                  </ReactMarkdown>
                </h2>

                {/* Interactive Options Choice Cards */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const letter = ["A", "B", "C", "D", "E"][optIdx] || "•";
                    const isOptSelected = selectedAnswer === option;

                    let cardStyle = "border-slate-800 bg-[#0c111d]/30 text-slate-350 hover:border-slate-700/80 hover:bg-[#0c111d]/75";
                    let letterStyle = "bg-slate-800 border-slate-750 text-slate-400";

                    if (isOptSelected) {
                      cardStyle = "border-blue-500 bg-blue-600/15 text-blue-300 font-bold shadow-md shadow-blue-900/10";
                      letterStyle = "bg-blue-600/20 border-blue-500/30 text-blue-400";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          setSelected({
                            ...selected,
                            [currentIndex]: option
                          })
                        }
                        className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 flex items-center gap-4 group cursor-pointer ${cardStyle}`}
                      >
                        <span className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${letterStyle}`}>
                          {letter}
                        </span>
                        <span className="text-xs md:text-sm leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Left/Right Control Buttons */}
              <div className="flex justify-between items-center bg-[#0c1015]/40 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  ← Previous
                </button>
                <span className="text-xs text-slate-500 font-semibold">{currentIndex + 1} / {questions.length}</span>
                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer animate-pulse"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    Next →
                  </button>
                )}
              </div>

            </div>
          </div>

        )}

      </div>
    </div>
  );
}