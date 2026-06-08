import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Course } from "../api";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.courses().then(setCourses).catch((e: Error) => setErr(e.message));
  }, []);

  return (
    <div className="w-full min-h-full p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Courses</h1>
        <p className="text-sm text-slate-400 mb-6">Choose a course to get started</p>

        {err && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-700/50 rounded-xl text-red-300 text-sm">
            {err}
          </div>
        )}

        {courses === null ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-700/20" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No courses available</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.slug}`}
                className="group rounded-2xl border border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 hover:border-blue-500/30 hover:bg-slate-800/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.06)] transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 flex items-center justify-center mb-4 group-hover:bg-blue-600/25 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C6.228 6.228 2 10.692 2 16s4.228 9.772 10 9.772 10-4.692 10-9.772c0-5.308-4.228-9.747-10-9.747z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-1">
                  {course.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {course.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
