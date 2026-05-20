import React from 'react';
import { 
  MoreVertical, Download, Star, Trash2, Edit2, Eye, Share2, 
  AlertTriangle, FolderInput, RotateCcw 
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
  onMove?: (id: string, name: string, type: 'file' | 'folder') => void;
  onShare?: (id: string, name: string, type: 'file' | 'folder') => void;
  // Trash mode
  trashMode?: boolean;
  onRestore?: (id: string, type: 'file' | 'folder') => void;
  onPermanentDelete?: (id: string, name: string, type: 'file' | 'folder') => void;
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
  onDelete,
  onMove,
  onShare,
  trashMode = false,
  onRestore,
  onPermanentDelete,
}) => {
  const [menuRect, setMenuRect] = React.useState<{ top: number, right: number } | null>(null);

  React.useEffect(() => {
    const handleClose = () => setActiveMenuId(null);
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('click', handleClose);
    };
  }, [setActiveMenuId]);

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
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="overflow-x-auto rounded-2xl">
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
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {!trashMode && (
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
                        <Star 
                          className="w-4 h-4" 
                          fill={item.isFavorite ? "currentColor" : "none"} 
                        />
                      </button>
                    )}
                    <div className="relative">
                      <button 
                        data-menu-id={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setMenuRect({ 
                            top: rect.bottom, 
                            right: window.innerWidth - rect.right 
                          });
                          setActiveMenuId(activeMenuId === item.id ? null : item.id);
                        }}
                        className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-all"
                      >
                        <MoreVertical className="w-4.5 h-4.5" />
                      </button>
                      
                      {activeMenuId === item.id && menuRect && (
                        <div 
                          className="fixed mt-2 w-52 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-[9999] py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                          style={{
                            top: menuRect.top + 350 > window.innerHeight ? 'auto' : menuRect.top,
                            bottom: menuRect.top + 350 > window.innerHeight ? window.innerHeight - menuRect.top + 40 : 'auto',
                            right: menuRect.right
                          }}
                        >
                          {trashMode ? (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRestore?.(item.id, item.type);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-green-500/10 hover:text-green-500 transition-all group/item border-l-2 border-transparent hover:border-green-500"
                              >
                                <RotateCcw className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                                <span className="font-medium">Restore</span>
                              </button>
                              <div className="my-1.5 border-t border-[var(--border-color)] mx-2"></div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPermanentDelete?.(item.id, item.name, item.type);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all group/item border-l-2 border-transparent hover:border-red-500 font-semibold"
                              >
                                <Trash2 className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                                <span>Delete Permanently</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {item.type === 'file' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onItemClick(item);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                                >
                                  <Eye className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                                  <span className="font-medium">Preview</span>
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRename(item.id, item.name, item.type);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                              >
                                <Edit2 className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                                <span className="font-medium">Rename</span>
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMove?.(item.id, item.name, item.type);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                              >
                                <FolderInput className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                                <span className="font-medium">Move</span>
                              </button>
                              {item.type === 'file' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload(item.id, item.name);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                                >
                                  <Download className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                                  <span className="font-medium">Download</span>
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShare?.(item.id, item.name, item.type);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                              >
                                <Share2 className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                                <span className="font-medium">Share</span>
                              </button>
                              <div className="my-1.5 border-t border-[var(--border-color)] mx-2"></div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(item.id, item.name, item.type);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all group/item border-l-2 border-transparent hover:border-red-500 font-semibold"
                              >
                                <Trash2 className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
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
            {!trashMode && (
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
                <Star 
                  className="w-3.5 h-3.5" 
                  fill={item.isFavorite ? "currentColor" : "none"}
                />
              </button>
            )}
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
            <div className="absolute top-12 right-4 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {trashMode ? (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore?.(item.id, item.type);
                      setActiveMenuId(null);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-green-500/10 hover:text-green-500 transition-all group/item border-l-2 border-transparent hover:border-green-500"
                  >
                    <RotateCcw className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                    <span className="font-medium">Restore</span>
                  </button>
                  <div className="my-1.5 border-t border-[var(--border-color)] mx-2"></div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onPermanentDelete?.(item.id, item.name, item.type);
                      setActiveMenuId(null);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all group/item border-l-2 border-transparent hover:border-red-500 font-semibold"
                  >
                    <Trash2 className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                    <span>Delete Permanently</span>
                  </button>
                </>
              ) : (
                <>
                  {item.type === 'file' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all"
                    >
                      <Eye className="w-4 h-4 opacity-70" />
                      <span className="font-medium">Preview</span>
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRename(item.id, item.name, item.type);
                      setActiveMenuId(null);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                  >
                    <Edit2 className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                    <span className="font-medium">Rename</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove?.(item.id, item.name, item.type);
                      setActiveMenuId(null);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                  >
                    <FolderInput className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                    <span className="font-medium">Move</span>
                  </button>
                  {item.type === 'file' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(item.id, item.name);
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                    >
                      <Download className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                      <span className="font-medium">Download</span>
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare?.(item.id, item.name, item.type);
                      setActiveMenuId(null);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all group/item border-l-2 border-transparent hover:border-blue-500"
                  >
                    <Share2 className="w-4 h-4 opacity-70 group-hover/item:scale-110 transition-transform" />
                    <span className="font-medium">Share</span>
                  </button>
                  <div className="my-1.5 border-t border-[var(--border-color)] mx-2"></div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id, item.name, item.type);
                      setActiveMenuId(null);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all group/item border-l-2 border-transparent hover:border-red-500 font-semibold"
                  >
                    <Trash2 className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;
