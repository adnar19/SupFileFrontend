import React from 'react';
import { ChevronRight, Home, Folder } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onHomeClick: () => void;
  onItemClick: (id: string) => void;
  currentPageName?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  onHomeClick, 
  onItemClick, 
  currentPageName 
}) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-[var(--text-tertiary)] overflow-x-auto whitespace-nowrap pb-2">
      <button 
        onClick={onHomeClick}
        className="flex items-center hover:text-blue-500 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>

      {items.length > 0 && items.map((item) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="w-4 h-4 opacity-30" />
          <button
            onClick={() => onItemClick(item.id)}
            className="flex items-center hover:text-blue-500 transition-colors"
          >
            <Folder className="w-3.5 h-3.5 mr-1.5 opacity-60" />
            <span>{item.name}</span>
          </button>
        </React.Fragment>
      ))}

      {currentPageName && (
        <>
          <ChevronRight className="w-4 h-4 opacity-30" />
          <span className="font-medium text-[var(--text-secondary)]">{currentPageName}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumbs;
