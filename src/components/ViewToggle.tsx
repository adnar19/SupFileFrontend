import React from 'react';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
      <button 
        onClick={() => onViewModeChange('list')}
        className={`p-1.5 rounded-lg transition-all ${
          viewMode === 'list' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
        }`}
      >
        <List className="w-4.5 h-4.5" />
      </button>
      <button 
        onClick={() => onViewModeChange('grid')}
        className={`p-1.5 rounded-lg transition-all ${
          viewMode === 'grid' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
        }`}
      >
        <Grid3X3 className="w-4.5 h-4.5" />
      </button>
    </div>
  );
};

export default ViewToggle;
