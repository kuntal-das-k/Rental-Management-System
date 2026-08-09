import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Something went wrong
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred while displaying this page.'}
            </p>
            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-medium transition-colors"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="px-4 py-2 border border-slate-200 hover:border-slate-400 text-slate-700 rounded-full text-xs font-medium transition-colors"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
