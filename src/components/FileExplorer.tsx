import React from 'react';
import { 
  MoreVertical, Download, Star, Trash2, Edit2, Eye, Share2, 
  AlertTriangle 
} from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  modified: string;
  size: string;
  icon: React.ReactNode;
  isFavorite: boolean;
}

interface FileExplorerProps {
  items: FileItem[];
  viewMode: 'grid' | 'list';
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onItemClick: (item: FileItem) => void;
  onFavoriteToggle: (id: string, type: 'file' | 'folder') => void;
  onDownload: (id: string, name: string) => void;
  onRename: (id: string, name: string, type: 'file' | 'folder') => void;
  onDelete: (id: string, name: string, type: 'file' | 'folder') => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  items,
  viewMode,
  activeMenuId,
  setActiveMenuId,
  onItemClick,
  onFavoriteToggle,
  onDownload,
  onRename,
  onDelete
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[var(--bg-secondary)] rounded-2xl border border-dashed border-[var(--border-color)]">
        <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-[var(--text-tertiary)]" />
        </div>
        <p className="text-[var(--text-secondary)] font-medium">No items found</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">This folder is empty or no files match your criteria.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/50">
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hidden sm:table-cell">Modified</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                className="group border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="font-medium text-[var(--text-primary)] truncate max-w-[150px] md:max-w-[300px]">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-full border border-[var(--border-color)]">
                    {item.fileType || (item.type === 'folder' ? 'Folder' : 'File')}
                  </span>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="text-sm text-[var(--text-tertiary)]">{item.modified}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[var(--text-tertiary)] font-mono">{item.size}</span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle(item.id, item.type);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        item.isFavorite 
                          ? 'text-yellow-500 bg-yellow-500/10' 
                          : 'text-[var(--text-tertiary)] hover:text-yellow-500 hover:bg-yellow-500/10'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-yellow-500' : ''}`} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === item.id ? null : item.id);
                        }}
                        className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-all"
                      >
                        <MoreVertical className="w-4.5 h-4.5" />
                      </button>
                      
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 mt-2 w-52 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-40 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                          {item.type === 'file' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onItemClick(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Preview</span>
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onRename(item.id, item.name, item.type);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Rename</span>
                          </button>
                          {item.type === 'file' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDownload(item.id, item.name);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          )}
                          <button 
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                          <div className="my-1 border-t border-[var(--border-color)]"></div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item.id, item.name, item.type);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="group relative bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-color)] hover:border-blue-500/50 hover:shadow-xl transition-all cursor-pointer overflow-visible"
          onClick={() => onItemClick(item)}
        >
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(item.id, item.type);
              }}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all shadow-lg ${
                item.isFavorite 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white/90 text-slate-600 hover:text-yellow-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-white' : ''}`} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(activeMenuId === item.id ? null : item.id);
              }}
              className="p-1.5 bg-white/90 text-slate-600 hover:text-blue-500 rounded-lg backdrop-blur-md shadow-lg transition-all"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              {item.icon}
            </div>
            <div className="w-full">
              <p className="font-semibold text-[var(--text-primary)] text-sm truncate px-1">
                {item.name}
              </p>
              <p className="text-[var(--text-tertiary)] text-[11px] font-medium uppercase tracking-tight mt-0.5">
                {item.size}
              </p>
            </div>
          </div>

          {activeMenuId === item.id && (
            <div className="absolute top-12 right-4 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              {item.type === 'file' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(item);
                    setActiveMenuId(null);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(item.id, item.name, item.type);
                  setActiveMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Rename</span>
              </button>
              {item.type === 'file' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item.id, item.name);
                    setActiveMenuId(null);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
              <button 
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <div className="my-1 border-t border-[var(--border-color)]"></div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id, item.name, item.type);
                  setActiveMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;
