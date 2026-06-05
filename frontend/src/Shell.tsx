import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import { api, type Course } from "./api";

function CourseNavItem({ course, onClick }: { course: Course, onClick?: () => void }) {
  return (
    <NavLink
      to={`/course/${course.slug}`}
      onClick={onClick}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border mb-1 ${
          isActive
            ? "bg-blue-600/15 text-blue-300 border-blue-500/30 shadow-sm"
            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent hover:border-slate-700/50"
        }`
      }
    >
      <span className="truncate flex-1 text-left">{course.title}</span>
    </NavLink>
  );
}

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
      <img
        src={`${import.meta.env.BASE_URL}logo.svg`}
        alt="Fraylon Academy"
        className="h-9 w-auto object-contain"
      />
      <span className="hidden sm:block font-bold text-slate-100 text-lg tracking-wide">
        Fraylon
      </span>
    </NavLink>
  );
}

export default function Shell() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isWorkspace = location.pathname.includes("/project/") && !location.pathname.endsWith("/project");

  useEffect(() => {
    api.courses().then(setCourses).catch(() => {});
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm z-50">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6 max-w-7xl mx-auto">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200 flex-shrink-0 md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Logo />

          <div className="flex-1" />

          <div className="flex items-center gap-3 text-sm">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-slate-300 truncate max-w-[140px] font-medium">
                  {user.name}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 px-3 md:px-4 py-2 text-sm font-medium transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50 whitespace-nowrap"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 md:relative md:inset-auto
          flex-shrink-0 overflow-y-auto border-r border-slate-700/50
          bg-slate-900/95 backdrop-blur-sm transition-transform duration-300 ease-in-out
          z-40 w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <nav className="p-4 space-y-1 w-64">
            <NavLink
              to="/"
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-blue-600/15 text-blue-300 border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent hover:border-slate-700/50"
                }`
              }
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </NavLink>

            {courses.length > 0 && (
              <>
                <div className="pt-6 pb-3 px-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Courses
                  </p>
                </div>

                {courses.map((course) => (
                  <CourseNavItem
                    key={course.id}
                    course={course}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </>
            )}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isWorkspace ? "overflow-hidden" : "overflow-auto"}`}>
          <div className={isWorkspace ? "w-full h-full" : "max-w-7xl mx-auto"}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}