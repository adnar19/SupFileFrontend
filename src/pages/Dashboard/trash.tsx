import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid3X3, List, Home, Trash2, File, Folder, ChevronRight, 
  RotateCcw, Image, FileText, Music, Video, Archive, 
  Presentation, Table, AlertTriangle, MoreVertical 
} from 'lucide-react';
import { getTrash, restoreFile, deleteFilePermanently } from '../../services/file';
import { restoreFolder } from '../../services/folder';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

interface TrashItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  deletedAt: string;
  size: string;
  icon: React.ReactNode;
}

const Trash: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Menus
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type: string, name: string) => {
    if (type === 'folder') return <Folder className="w-5 h-5 text-slate-400" />;
    
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="w-5 h-5 text-slate-400" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Image className="w-5 h-5 text-slate-400" />;
      case 'mp4':
      case 'mov': return <Video className="w-5 h-5 text-slate-400" />;
      case 'mp3':
      case 'wav': return <Music className="w-5 h-5 text-slate-400" />;
      case 'zip':
      case 'rar': return <Archive className="w-5 h-5 text-slate-400" />;
      case 'ppt':
      case 'pptx': return <Presentation className="w-5 h-5 text-slate-400" />;
      case 'xls':
      case 'xlsx': return <Table className="w-5 h-5 text-slate-400" />;
      default: return <File className="w-5 h-5 text-slate-400" />;
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

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await getTrash();
      if (res.success) {
        const { folders, files } = res.data;
        
        const folderItems: TrashItem[] = folders.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'folder',
          fileType: 'Folder',
          deletedAt: new Date(f.updatedAt).toLocaleDateString(),
          size: '--',
          icon: getIcon('folder', f.name)
        }));

        const fileItems: TrashItem[] = files.map((f: any) => {
          const extension = f.name.split('.').pop()?.toLowerCase();
          let customType = f.mimeType?.split('/')[1]?.toUpperCase() || 'File';
          if (['ppt', 'pptx'].includes(extension)) customType = 'PowerPoint';
          if (['xls', 'xlsx'].includes(extension)) customType = 'Excel';
          
          return {
            id: f.id,
            name: f.name,
            type: 'file',
            fileType: customType,
            deletedAt: new Date(f.updatedAt).toLocaleDateString(),
            size: formatSize(f.size),
            icon: getIcon('file', f.name)
          };
        });

        setItems([...folderItems, ...fileItems]);
      }
    } catch (error) {
      toast.error("Failed to fetch trash");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  const handleRestore = async (id: string, type: 'file' | 'folder') => {
    try {
      if (type === 'folder') {
        await restoreFolder(id);
      } else {
        await restoreFile(id);
      }
      toast.success("Item restored successfully");
      fetchTrash();
    } catch (error) {
      toast.error("Failed to restore item");
    } finally {
      setActiveMenuId(null);
    }
  };

  const handlePermanentDeleteClick = (id: string, name: string, type: 'file' | 'folder') => {
    setItemToDelete({ id, name, type });
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const confirmPermanentDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      if (itemToDelete.type === 'file') {
        await deleteFilePermanently(itemToDelete.id);
        toast.success("File deleted permanently");
      } else {
        toast.info("Individual folder permanent delete coming soon. Use 'Empty Trash' for now.");
      }
      fetchTrash();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete permanently");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          <Link to="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-[var(--text-primary)]">Trash</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-500"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            onClick={() => toast.info("Empty Trash feature coming soon")}
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash</span>
          </button>
          
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
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="h-64 flex justify-center items-center">
            <SyncLoader color="#1076fc" size={15} />
          </div>
        ) : items.length === 0 ? (
          <div className="h-64 flex flex-col justify-center items-center space-y-4 opacity-50">
            <Trash2 className="w-16 h-16" />
            <p className="text-lg font-medium">Trash is empty</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th className="p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Name</th>
                  <th className="p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Type</th>
                  <th className="p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Size</th>
                  <th className="p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Deleted At</th>
                  <th className="p-4 text-sm font-semibold text-center" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b hover:bg-[var(--bg-tertiary)] transition-colors group" 
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.fileType}</td>
                    <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.size}</td>
                    <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.deletedAt}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleRestore(item.id, item.type)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-green-500 transition-all"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handlePermanentDeleteClick(item.id, item.name, item.type)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-red-500 transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                className="flex flex-col items-center p-4 rounded-xl border hover:border-blue-500/30 transition-all group relative"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
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
                      className="absolute right-0 mt-1 w-40 rounded-lg shadow-xl border z-20 overflow-hidden"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleRestore(item.id, item.type)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-green-500/10 text-green-500 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteClick(item.id, item.name, item.type)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-3 transform group-hover:scale-105 transition-transform opacity-60">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-center truncate w-full mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.deletedAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permanent Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)} 
        title="Delete Permanently"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-500">
              Warning: This action is irreversible!
            </p>
          </div>
          
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            Are you sure you want to permanently delete <span className="font-bold underline">"{itemToDelete?.name}"</span>?
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
              onClick={confirmPermanentDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trash;
