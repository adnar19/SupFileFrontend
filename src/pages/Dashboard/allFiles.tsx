import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFileIcon, formatFileSize, getCustomFileType } from '../../utils/fileUtils';
import { getUserFiles, deleteFile, downloadFile, toggleFavoriteApi, renameFileApi } from '../../services/file';
import { renameFolderApi, moveFolderApi } from '../../services/folder';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import { PreviewModal } from '../../components/PreviewModal';
import { useFileSystem } from '../../contexts/FileSystemContext';
import ViewToggle from '../../components/ViewToggle';
import FileExplorer, { type FileItem } from '../../components/FileExplorer';
import Breadcrumbs from '../../components/Breadcrumbs';
import MoveModal from '../../components/MoveModal';
import { moveFileApi } from '../../services/file';

const AllFiles: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentFolderId, setCurrentFolderName, refreshTrigger } = useFileSystem();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20
  });

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [itemToPreview, setItemToPreview] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await getUserFiles(page, pagination.limit);
      if (res.success) {
        const fileItems: FileItem[] = res.data.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'file',
          fileType: getCustomFileType(f.mimeType, f.name),
          modified: new Date(f.updatedAt).toLocaleDateString(),
          size: formatFileSize(f.size),
          icon: getFileIcon('file', f.name),
          isFavorite: f.isFavorited || false
        }));

        setItems(fileItems);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.currentPage);
  }, [pagination.currentPage, refreshTrigger]);

  useEffect(() => {
    setCurrentFolderId(undefined);
    setCurrentFolderName("All Files");
  }, []);

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'file') {
      setItemToPreview(item);
      setIsPreviewModalOpen(true);
    }
  };

  const handleFavoriteToggle = async (id: string, type: 'file' | 'folder') => {
    try {
      await toggleFavoriteApi(id, type);
      setItems(items.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ));
      toast.success("Favorite updated");
    } catch (error) {
      toast.error("Failed to update favorite");
    }
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
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const handleRenameClick = (id: string, name: string, type: 'file' | 'folder') => {
    setItemToRename({ id, name, type });
    setNewName(name);
    setIsRenameModalOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmRename = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!itemToRename || !newName.trim() || newName === itemToRename.name) return;

    try {
      setIsRenaming(true);
      if (itemToRename.type === 'file') {
        await renameFileApi(itemToRename.id, newName);
      } else {
        await renameFolderApi(itemToRename.id, newName);
      }
      toast.success("Renamed successfully");
      fetchData(pagination.currentPage);
      setIsRenameModalOpen(false);
    } catch (error) {
      toast.error("Failed to rename");
    } finally {
      setIsRenaming(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await deleteFile(itemToDelete.id);
      toast.success("Deleted successfully");
      fetchData(pagination.currentPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveClick = (id: string, name: string, type: 'file' | 'folder') => {
    setItemToMove({ id, name, type });
    setIsMoveModalOpen(true);
  };

  const confirmMove = async (targetFolderId: string | null) => {
    if (!itemToMove) return;
    try {
      setIsMoving(true);
      if (itemToMove.type === 'file') {
        await moveFileApi(itemToMove.id, targetFolderId);
      } else {
        await moveFolderApi(itemToMove.id, targetFolderId);
      }
      toast.success("Moved successfully");
      fetchData(pagination.currentPage);
      setIsMoveModalOpen(false);
    } catch (error) {
      toast.error("Failed to move");
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <Breadcrumbs 
          items={[]} 
          onHomeClick={() => {}}
          onItemClick={() => {}}
          currentPageName="All Files"
        />
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <SyncLoader color="#3b82f6" size={10} />
          <p className="text-[var(--text-tertiary)] animate-pulse font-medium">Scanning your library...</p>
        </div>
      ) : (
        <FileExplorer 
          items={items}
          viewMode={viewMode}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          onItemClick={handleItemClick}
          onFavoriteToggle={handleFavoriteToggle}
          onDownload={handleDownload}
          onRename={handleRenameClick}
          onDelete={handleDeleteClick}
          onMove={handleMoveClick}
        />
      )}

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

      {/* Modals */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete File">
        <div className="p-4 text-center">
          <p className="mb-6 text-[var(--text-secondary)]">
            Are you sure you want to delete <span className="font-bold text-[var(--text-primary)]">{itemToDelete?.name}</span>?
          </p>
          <div className="flex justify-center space-x-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">Cancel</button>
            <button onClick={confirmDelete} disabled={isDeleting} className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50">
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} title="Rename Item">
        <form onSubmit={confirmRename} className="p-4 space-y-4">
          <input 
            type="text" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-blue-500 transition-all"
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setIsRenameModalOpen(false)} className="px-6 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">Cancel</button>
            <button type="submit" disabled={isRenaming} className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50">
              {isRenaming ? "Renaming..." : "Rename"}
            </button>
          </div>
        </form>
      </Modal>

      <PreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} file={itemToPreview} />

      <MoveModal 
        isOpen={isMoveModalOpen} 
        onClose={() => setIsMoveModalOpen(false)} 
        onConfirm={confirmMove}
        itemName={itemToMove?.name || ""}
        isMoving={isMoving}
      />
    </div>
  );
};

export default AllFiles;
