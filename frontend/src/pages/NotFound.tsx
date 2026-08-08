import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-8xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-white">Page Not Found</h1>
            <p className="text-sm text-slate-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
            >
              <Home className="w-4 h-4" />
              Go to Storefront
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
