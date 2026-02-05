import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-5 lg:p-10 transition-colors duration-300">
      <div className="text-center max-w-md w-full">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <FileQuestion className="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            {/* Error Code */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight transition-colors">
          Page Not Found
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed transition-colors">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)]"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
          >
            <Search className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
