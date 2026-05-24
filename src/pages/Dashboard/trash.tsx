import React, { useState, useEffect } from 'react';
import { Trash2, ChevronRight, AlertTriangle, ChevronLeft } from 'lucide-react';
import { getTrash, restoreFile, deleteFilePermanently, emptyTrashApi } from '../../services/file';
import { restoreFolder, deleteFolderPermanentlyApi } from '../../services/folder';
import { getFileIcon, formatFileSize, getCustomFileType } from '../../utils/fileUtils';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import Breadcrumbs from '../../components/Breadcrumbs';
import ViewToggle from '../../components/ViewToggle';
import FileExplorer, { type FileItem } from '../../components/FileExplorer';

const Trash: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false);

  const fetchTrash = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await getTrash(page, pagination.limit);
      if (res.success) {
        const { folders, files } = res.data;

        const folderItems: FileItem[] = folders.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'folder',
          fileType: 'Folder',
          modified: new Date(f.updatedAt).toLocaleDateString(),
          size: '--',
          icon: getFileIcon('folder', f.name),
          isFavorite: false,
        }));

        const fileItems: FileItem[] = files.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'file',
          fileType: getCustomFileType(f.mimeType, f.name),
          fileMime: f.mimeType,
          modified: new Date(f.updatedAt).toLocaleDateString(),
          size: formatFileSize(f.size),
          icon: getFileIcon('file', f.name),
          isFavorite: false,
        }));

        setItems([...folderItems, ...fileItems]);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch trash');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash(pagination.currentPage);
  }, [pagination.currentPage]);

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
      toast.success('Item restored successfully');
      fetchTrash(pagination.currentPage);
    } catch {
      toast.error('Failed to restore item');
    }
  };

  const handlePermanentDeleteClick = (id: string, name: string, type: 'file' | 'folder') => {
    setItemToDelete({ id, name, type });
    setIsDeleteModalOpen(true);
  };

  const confirmPermanentDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      if (itemToDelete.type === 'file') {
        await deleteFilePermanently(itemToDelete.id);
        toast.success('File deleted permanently');
      } else {
        await deleteFolderPermanentlyApi(itemToDelete.id);
        toast.success('Folder deleted permanently');
      }
      window.dispatchEvent(new Event('storage-updated'));
      fetchTrash(pagination.currentPage);
      setIsDeleteModalOpen(false);
    } catch {
      toast.error('Failed to delete permanently');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      setIsEmptyingTrash(true);
      await emptyTrashApi();
      toast.success('Trash emptied successfully');
      window.dispatchEvent(new Event('storage-updated'));
      setIsEmptyTrashModalOpen(false);
      fetchTrash();
    } catch {
      toast.error('Failed to empty trash');
    } finally {
      setIsEmptyingTrash(false);
    }
  };

  // No-op handlers required by FileExplorer but unused in trashMode
  const noop = () => {};
  const noopStr = (_id: string, _name: string) => {};

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <Breadcrumbs
          items={[]}
          onHomeClick={noop}
          onItemClick={noop}
          currentPageName="Trash"
        />
        <div className="flex items-center space-x-3">
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]"
            onClick={() => setIsEmptyTrashModalOpen(true)}
            disabled={items.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash</span>
          </button>
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <SyncLoader color="#3b82f6" size={10} />
          <p className="text-[var(--text-tertiary)] animate-pulse font-medium">Loading trash...</p>
        </div>
      ) : (
        <FileExplorer
          items={items}
          viewMode={viewMode}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          onItemClick={noop}
          onFavoriteToggle={noop}
          onDownload={noopStr}
          onRename={noop}
          onDelete={noop}
          trashMode={true}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDeleteClick}
        />
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-2">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                pagination.currentPage === i + 1
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Permanent Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Delete Permanently"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-500">Warning: This action is irreversible!</p>
          </div>
          <p className="text-sm text-[var(--text-primary)]">
            Are you sure you want to permanently delete <span className="font-bold underline">"{itemToDelete?.name}"</span>?
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmPermanentDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Empty Trash Modal */}
      <Modal
        isOpen={isEmptyTrashModalOpen}
        onClose={() => !isEmptyingTrash && setIsEmptyTrashModalOpen(false)}
        title="Empty Trash"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-500">Warning: This action is irreversible!</p>
          </div>
          <p className="text-sm text-[var(--text-primary)]">
            Are you sure you want to permanently delete <span className="font-bold">all {items.length} item{items.length !== 1 ? 's' : ''}</span> in the trash?
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isEmptyingTrash}
              onClick={() => setIsEmptyTrashModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEmptyTrash}
              disabled={isEmptyingTrash}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isEmptyingTrash ? 'Emptying...' : 'Empty Trash'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trash;
