import React, { useState, useEffect } from 'react';
import { 
  Grid3X3, List, Home, Star, Trash2, File, Folder, Image as ImageIcon, 
  ChevronRight, Share2, BarChart3, FileText, Music, Video, 
  Archive, Presentation, Table, Download, MoreVertical, ChevronLeft, Edit2 
} from 'lucide-react';
import { getFolderContents, deleteFolder, renameFolderApi } from '../../services/folder';
import { deleteFile, downloadFile, toggleFavoriteApi, renameFileApi } from '../../services/file';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import { AlertTriangle } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  modified: string;
  size: string;
  icon: React.ReactNode;
  isFavorite: boolean;
}

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  
  // Menus
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const { 
    currentFolderId, setCurrentFolderId, 
     setCurrentFolderName, 
    refreshTrigger, triggerRefresh 
  } = useFileSystem();

  const getIcon = (type: string, name: string) => {
    if (type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />;
    
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <ImageIcon className="w-5 h-5 text-green-500" />;
      case 'mp4':
      case 'mov': return <Video className="w-5 h-5 text-purple-500" />;
      case 'mp3':
      case 'wav': return <Music className="w-5 h-5 text-pink-500" />;
      case 'zip':
      case 'rar': return <Archive className="w-5 h-5 text-orange-500" />;
      case 'ppt':
      case 'pptx': return <Presentation className="w-5 h-5 text-orange-600" />;
      case 'xls':
      case 'xlsx': return <Table className="w-5 h-5 text-emerald-600" />;
      default: return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatSize = (bytes: string) => {
    const b = parseInt(bytes);
    if (isNaN(b) || b === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setItems([]);
      const res = await getFolderContents(currentFolderId || "root", page, pagination.limit);
      if (res.success) {
        const { folders, files, breadcrumbs: bc, currentFolder } = res.data;
        
        if (currentFolder) {
          setCurrentFolderName(currentFolder.name);
          // Auto-sync currentFolderId if we just loaded root
          if (!currentFolderId && currentFolder.parentId === null) {
            // Root already identified
          }
        }

        const folderItems: FileItem[] = folders.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'folder',
          fileType: 'Folder',
          modified: new Date(f.updatedAt).toLocaleDateString(),
          size: '--',
          icon: getIcon('folder', f.name),
          isFavorite: f.favorites?.length > 0
        }));

        const fileItems: FileItem[] = files.map((f: any) => {
          const extension = f.name.split('.').pop()?.toLowerCase();
          let customType = f.mimeType?.split('/')[1]?.toUpperCase() || 'File';
          
          if (['ppt', 'pptx'].includes(extension)) customType = 'PowerPoint';
          if (['xls', 'xlsx'].includes(extension)) customType = 'Excel';
          if (extension === 'pdf') customType = 'PDF Document';

          return {
            id: f.id,
            name: f.name,
            type: 'file',
            fileType: customType,
            modified: new Date(f.createdAt).toLocaleDateString(),
            size: formatSize(f.size),
            icon: getIcon('file', f.name),
            isFavorite: f.favorites?.length > 0
          };
        });

        setItems([...folderItems, ...fileItems]);
        setBreadcrumbs(bc);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.currentPage);
  }, [currentFolderId, refreshTrigger, pagination.currentPage]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  const handleHomeClick = () => {
    setCurrentFolderId(undefined);
    setCurrentFolderName(undefined);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFolderClick = (id: string) => {
    setCurrentFolderId(id);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const toggleFavorite = async (id: string, type: 'file' | 'folder') => {
    try {
      await toggleFavoriteApi(id, type);
      setItems(items.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
      toast.success("Favorite status updated");
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  const handleRenameClick = (id: string, name: string, type: 'file' | 'folder') => {
    setItemToRename({ id, name, type });
    setNewName(name);
    setIsRenameModalOpen(true);
    setActiveMenuId(null);
  };

  const confirmRename = async () => {
    if (!itemToRename || !newName.trim()) return;
    try {
      setIsRenaming(true);
      if (itemToRename.type === 'file') {
        await renameFileApi(itemToRename.id, newName.trim());
      } else {
        await renameFolderApi(itemToRename.id, newName.trim());
      }
      setItems(items.map(item => item.id === itemToRename.id ? { ...item, name: newName.trim() } : item));
      toast.success("Renamed successfully");
      setIsRenameModalOpen(false);
    } catch (error) {
      toast.error("Failed to rename");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleShare = (id: string) => {
    console.log('Share item:', id);
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const blob = await downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const handleDelete = (id: string, name: string, type: 'file' | 'folder') => {
    setItemToDelete({ id, name, type });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      if (itemToDelete.type === 'folder') {
        await deleteFolder(itemToDelete.id);
      } else {
        await deleteFile(itemToDelete.id);
      }
      toast.success("Item moved to trash");
      triggerRefresh();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="min-h-full flex flex-col">
        
        {/* Header with Breadcrumbs and View Toggle */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--bg-primary)]">
          <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <button onClick={handleHomeClick} className="hover:text-[var(--text-primary)] transition-colors">
              <Home className="w-4 h-4" />
            </button>
            {breadcrumbs.map((bc) => (
              <React.Fragment key={bc.id}>
                <ChevronRight className="w-4 h-4" />
                <button 
                  onClick={() => handleFolderClick(bc.id)}
                  className={`hover:text-[var(--text-primary)] transition-colors ${currentFolderId === bc.id ? 'font-semibold text-[var(--text-primary)]' : ''}`}
                >
                  {bc.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-1 border border-[var(--border-color)]">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[var(--card-bg)] shadow-sm text-blue-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[var(--card-bg)] shadow-sm text-blue-500' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="h-64 flex justify-center items-center">
              <SyncLoader color="#1076fc" size={15} />
            </div>
          ) : items.length === 0 ? (
            <div className="h-64 flex flex-col justify-center items-center space-y-4 opacity-50">
              <Folder className="w-16 h-16" />
              <p className="text-lg font-medium">This folder is empty</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="rounded-xl border overflow-visible shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                    <th className="p-4 text-sm font-semibold rounded-tl-xl" style={{ color: 'var(--text-secondary)' }}>Name</th>
                    <th className="p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Type</th>
                    <th className="p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Size</th>
                    <th className="p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Modified</th>
                    <th className="p-4 text-sm font-semibold text-center rounded-tr-xl" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b hover:bg-[var(--bg-tertiary)] transition-colors group ${index === items.length - 1 ? 'last:border-b-0' : ''}`} 
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <td className={`p-4 ${index === items.length - 1 ? 'rounded-bl-xl' : ''}`}>
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => item.type === 'folder' && handleFolderClick(item.id)}
                        >
                          {item.icon}
                          <span className="text-sm font-medium hover:text-blue-500 transition-colors">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.fileType}</td>
                      <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.size}</td>
                      <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.modified}</td>
                      <td className={`p-4 relative ${index === items.length - 1 ? 'rounded-br-xl' : ''}`}>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === item.id ? null : item.id);
                            }}
                            className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === item.id && (
                            <div 
                              className="absolute right-8 top-10 mt-1 w-44 rounded-lg shadow-xl border z-20 overflow-hidden"
                              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.type === 'file' && (
                                <>
                                  <button
                                    onClick={() => { handleDownload(item.id, item.name); setActiveMenuId(null); }}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-500 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                  </button>
                                  <button
                                    onClick={() => { handleShare(item.id); setActiveMenuId(null); }}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-500 transition-colors"
                                  >
                                    <Share2 className="w-4 h-4" />
                                    <span>Share</span>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => { toggleFavorite(item.id, item.type); setActiveMenuId(null); }}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-yellow-500/10 text-[var(--text-primary)] hover:text-yellow-500 transition-colors"
                              >
                                <Star className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
                                <span>{item.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                              </button>
                              <button
                                onClick={() => handleRenameClick(item.id, item.name, item.type)}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-500 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span>Rename</span>
                              </button>
                              <div className="h-px bg-[var(--border-color)]" />
                              <button
                                onClick={() => { handleDelete(item.id, item.name, item.type); setActiveMenuId(null); }}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col items-center p-4 rounded-xl border hover:border-blue-500/30 transition-all cursor-pointer group relative"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                  onClick={() => item.type === 'folder' && handleFolderClick(item.id)}
                >
                  {/* Action Menu Button */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                      }}
                      className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === item.id && (
                      <div 
                        className="absolute right-0 mt-1 w-44 rounded-lg shadow-xl border z-20 overflow-hidden"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.type === 'file' && (
                          <>
                            <button
                              onClick={() => handleDownload(item.id, item.name)}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-500 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => handleShare(item.id)}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-500 transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { toggleFavorite(item.id, item.type); setActiveMenuId(null); }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-yellow-500/10 text-[var(--text-primary)] hover:text-yellow-500 transition-colors"
                        >
                          <Star className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
                          <span>{item.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                        </button>
                        <button
                          onClick={() => handleRenameClick(item.id, item.name, item.type)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Rename</span>
                        </button>
                        <div className="h-px bg-[var(--border-color)]" />
                        <button
                          onClick={() => handleDelete(item.id, item.name, item.type)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 transform group-hover:scale-105 transition-transform">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-center truncate w-full mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.type === 'folder' ? item.fileType : item.size}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && items.length > 0 && (
            <div className="mt-8 flex items-center justify-between px-2">
              <p className="text-sm text-[var(--text-tertiary)]">
                Showing <span className="font-medium text-[var(--text-primary)]">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to <span className="font-medium text-[var(--text-primary)]">{Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)}</span> of <span className="font-medium text-[var(--text-primary)]">{pagination.totalItems}</span> items
              </p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                        pagination.currentPage === page 
                        ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
                  className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)} 
        title="Move to Trash"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              Are you sure you want to move <span className="font-bold text-orange-500">"{itemToDelete?.name}"</span> to trash?
            </p>
          </div>
          
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            You can restore this item from the Trash section later.
          </p>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "var(--text-secondary)", backgroundColor: "transparent" }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
            >
              {isDeleting ? "Moving..." : "Move to Trash"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal 
        isOpen={isRenameModalOpen} 
        onClose={() => !isRenaming && setIsRenameModalOpen(false)} 
        title="Rename Item"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              New Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              style={{ 
                backgroundColor: "var(--bg-secondary)", 
                borderColor: "var(--border-color)",
                color: "var(--text-primary)"
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmRename();
              }}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isRenaming}
              onClick={() => setIsRenameModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "var(--text-secondary)", backgroundColor: "transparent" }}
            >
              Cancel
            </button>
            <button
              onClick={confirmRename}
              disabled={isRenaming || !newName.trim() || newName === itemToRename?.name}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isRenaming ? "Renaming..." : "Rename"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
