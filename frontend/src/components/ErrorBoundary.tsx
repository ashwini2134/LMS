import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.hash = "#/";
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600/20">
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.74-2.99l-7.07-12.25a2 2 0 00-3.48 0L3.19 16.01A2 2 0 004.93 19z"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-xl font-bold text-slate-100">
            Something went wrong
          </h1>

          <p className="mb-6 text-sm text-slate-400">
            Refresh the page or click below to go home.
          </p>

          {this.state.error?.message && (
            <pre className="mb-6 max-h-32 overflow-auto rounded-lg border border-slate-700/50 bg-slate-900/60 p-3 text-left font-mono text-xs text-slate-400">
              {this.state.error.message}
            </pre>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
