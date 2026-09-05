import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[24px] p-8 max-w-lg w-full space-y-5">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              !
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Something went wrong</h1>
              <p className="text-sm text-[#64748B]">
                We encountered an unexpected issue while rendering this page. You can reload the page or return to the dashboard.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-[12px] transition-all cursor-pointer shadow-sm"
              >
                Reload Page
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold rounded-[12px] transition-all cursor-pointer"
              >
                Go to Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left text-xs bg-slate-50 p-4 rounded-[12px] border border-slate-200 mt-4 overflow-auto max-h-48 text-red-600 font-mono">
                <summary className="cursor-pointer font-bold text-[#0F172A] mb-1">Developer Error Details</summary>
                <pre>{this.state.error?.toString()}</pre>
                <pre>{this.state.error?.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
