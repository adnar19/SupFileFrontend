import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  getFileIcon,
  formatFileSize,
  getCustomFileType,
  getFileCategory,
} from "../../utils/fileUtils";
import {
  getUserFiles,
  deleteFile,
  downloadFile,
  toggleFavoriteApi,
  renameFileApi,
  searchFilesAndFolders,
} from "../../services/file";
import { renameFolderApi, moveFolderApi } from "../../services/folder";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import { PreviewModal } from "../../components/PreviewModal";
import { useFileSystem } from "../../contexts/FileSystemContext";
import ViewToggle from "../../components/ViewToggle";
import FileExplorer, { type FileItem } from "../../components/FileExplorer";
import Breadcrumbs from "../../components/Breadcrumbs";
import MoveModal from "../../components/MoveModal";
import ShareModal from "../../components/ShareModal";
import { moveFileApi } from "../../services/file";

const AllFiles: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [items, setItems] = useState<FileItem[]>([]);
  const [allItems, setAllItems] = useState<FileItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentFolderId, setCurrentFolderName, refreshTrigger } =
    useFileSystem();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [itemToPreview, setItemToPreview] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [itemToShare, setItemToShare] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<string>("");
  const [searchDateFrom, setSearchDateFrom] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleShareClick = (
    id: string,
    name: string,
    type: "file" | "folder",
  ) => {
    setItemToShare({ id, name, type });
    setIsShareModalOpen(true);
  };

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await getUserFiles(page, pagination.limit);
      if (res.success) {
        const fileItems: FileItem[] = res.data.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: "file",
          fileType: getCustomFileType(f.mimeType, f.name),
          fileMime: f.mimeType,
          modified: new Date(f.updatedAt).toLocaleDateString(),
          fileDate: f.updatedAt || f.createdAt,
          size: formatFileSize(f.size),
          icon: getFileIcon("file", f.name),
          isFavorite: f.isFavorite || false,
        }));

        setItems(fileItems);
        setPagination(res.pagination);
        // reset cached allItems when page data changes
        setAllItems(null);
      }
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      setIsSearching(true);
      // determine total items from pagination if present
      const total = pagination.totalItems && pagination.totalItems > 0 ? pagination.totalItems : 1000;
      const res = await getUserFiles(1, total);
      if (res.success) {
        const fileItems: FileItem[] = res.data.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: "file",
          fileType: getCustomFileType(f.mimeType, f.name),
          fileMime: f.mimeType,
          fileDate: f.updatedAt || f.createdAt,
          modified: new Date(f.updatedAt).toLocaleDateString(),
          size: formatFileSize(f.size),
          icon: getFileIcon("file", f.name),
          isFavorite: f.isFavorite || false,
        }));
        setAllItems(fileItems);
      }
    } catch (err) {
      console.error("Failed to fetch all items:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.currentPage);
  }, [pagination.currentPage, refreshTrigger]);

  useEffect(() => {
    setCurrentFolderId(undefined);
    setCurrentFolderName("All Files");
  }, []);

  useEffect(() => {
    // Consider filters active when any control has a value (for UI state)
    const hasFilters = !!(searchQuery.trim() || searchType || searchDateFrom);
    setIsFilterActive(hasFilters);

    // Only perform server-side search when the user typed a query.
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const results = await searchFilesAndFolders(
            searchQuery.trim(),
            50,
            searchType || undefined,
            searchDateFrom || undefined,
          );
          if (results && results.success) {
            setSearchResults(results.data.files || []);
          }
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, searchType, searchDateFrom]);

  useEffect(() => {
    // when user applies type/date filters (without search query), prefetch all items for accurate filtering
    const hasSearchQuery = searchQuery.trim() !== "";
    const hasOtherFilters = !!(searchType || searchDateFrom);
    if (!hasSearchQuery && hasOtherFilters) {
      fetchAllItems();
    }
  }, [searchType, searchDateFrom]);

  const clearFilters = () => {
    setSearchQuery("");
    setSearchType("");
    setSearchDateFrom("");
    setIsFilterActive(false);
  };

  const getDisplayItems = (): FileItem[] => {
    let displayItems: FileItem[] = [];

    // If there's an actual search query, show server search results when available.
    if (searchQuery.trim() && !isSearching) {
      // If we have a cached full list, prefer filtering it locally by the search term
      if (allItems && allItems.length > 0) {
        const term = searchQuery.trim().toLowerCase();
        displayItems = allItems.filter((it) => it.name.toLowerCase().includes(term));
      } else {
        displayItems = searchResults.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: "file" as const,
          fileType: getCustomFileType(f.mimeType, f.name),
          fileMime: f.mimeType,
          fileDate: f.updatedAt ?? f.createdAt,
          modified: new Date(f.updatedAt ?? f.createdAt).toLocaleDateString(),
          size: formatFileSize(f.size),
          icon: getFileIcon("file", f.name),
          isFavorite: f.isFavorite || false,
        }));
      }
    } else {
      displayItems = items;
    }

    if (searchType || searchDateFrom) {
      // if we have a cached full list (allItems), use it as the base for filtering
      const base = (!searchQuery.trim() && allItems) ? allItems : displayItems;
      displayItems = base.filter((item) => {
        if (item.type === 'folder') return false;
        const category = getFileCategory((item as any).fileMime, item.name);
        switch (searchType) {
          case 'image':
            return category === 'image';
          case 'video':
            return category === 'video';
          case 'audio':
            return category === 'audio';
          case 'document':
            return category === 'document';
          case 'other':
            return category === 'other';
          default:
            return true;
        }
      });
      // then apply date filter if present
      if (searchDateFrom) {
        const from = new Date(searchDateFrom);
        displayItems = displayItems.filter((item) => {
          const d = (item as any).fileDate ? new Date((item as any).fileDate) : new Date();
          return d >= from;
        });
      }
    }

    return displayItems;
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === "file") {
      setItemToPreview(item);
      setIsPreviewModalOpen(true);
    }
  };

  const handleFavoriteToggle = async (id: string, type: "file" | "folder") => {
    try {
      await toggleFavoriteApi(id, type);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
        ),
      );
      toast.success("Favorite updated");
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const blob = await downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const handleRenameClick = (
    id: string,
    name: string,
    type: "file" | "folder",
  ) => {
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
    if (!itemToRename || !newName.trim() || newName === itemToRename.name)
      return;

    try {
      setIsRenaming(true);
      if (itemToRename.type === "file") {
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

  const handleMoveClick = (
    id: string,
    name: string,
    type: "file" | "folder",
  ) => {
    setItemToMove({ id, name, type });
    setIsMoveModalOpen(true);
  };

  const confirmMove = async (targetFolderId: string | null) => {
    if (!itemToMove) return;
    try {
      setIsMoving(true);
      if (itemToMove.type === "file") {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <Breadcrumbs
          items={[]}
          onHomeClick={() => {}}
          onItemClick={() => {}}
          currentPageName="All Files"
        />
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-tertiary)" }}
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            style={{
              backgroundColor: showFilters
                ? "var(--bg-hover)"
                : "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div
            className="mt-3 p-4 rounded-xl flex flex-col sm:flex-row gap-3"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex-1">
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                File Type
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">All types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex-1">
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Date From
              </label>
              <input
                type="date"
                value={searchDateFrom}
                onChange={(e) => setSearchDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {(searchType || searchDateFrom) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchType("");
                    setSearchDateFrom("");
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-500/10"
                  style={{
                    color: "#ef4444",
                    border: "1px solid #ef4444",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Banner */}
      {isFilterActive && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5"
              style={{ color: "var(--text-primary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Filtering files
                {searchQuery && <span> for "{searchQuery}"</span>}
                {searchType && <span> • Type: {searchType === 'image' ? 'Images' : searchType === 'video' ? 'Vidéos' : searchType === 'document' ? 'Documents' : searchType === 'audio' ? 'Audio' : 'Autres'}</span>}
                {searchDateFrom && (
                  <span>
                    {" "}
                    • From: {new Date(searchDateFrom).toLocaleDateString()}
                  </span>
                )}
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {getDisplayItems().length} file
                {getDisplayItems().length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {loading || isSearching ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <SyncLoader color="#3b82f6" size={10} />
          <p className="text-[var(--text-tertiary)] animate-pulse font-medium">
            {isSearching ? "Searching..." : "Scanning your library..."}
          </p>
        </div>
      ) : isFilterActive && getDisplayItems().length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <svg
            className="w-16 h-16"
            style={{ color: "var(--text-tertiary)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p
            className="text-base font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            No files match your filters
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <FileExplorer
          items={getDisplayItems()}
          viewMode={viewMode}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          onItemClick={handleItemClick}
          onFavoriteToggle={handleFavoriteToggle}
          onDownload={handleDownload}
          onRename={handleRenameClick}
          onDelete={handleDeleteClick}
          onMove={handleMoveClick}
          onShare={handleShareClick}
        />
      )}

      {!loading && !isFilterActive && pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-2">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
              }))
            }
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, currentPage: i + 1 }))
              }
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                pagination.currentPage === i + 1
                  ? "bg-blue-500 text-white shadow-lg scale-105"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
              }))
            }
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete File"
      >
        <div className="p-4 text-center">
          <p className="mb-6 text-[var(--text-secondary)]">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[var(--text-primary)]">
              {itemToDelete?.name}
            </span>
            ?
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Item"
      >
        <form onSubmit={confirmRename} className="p-4 space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-blue-500 transition-all"
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsRenameModalOpen(false)}
              className="px-6 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRenaming}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
            >
              {isRenaming ? "Renaming..." : "Rename"}
            </button>
          </div>
        </form>
      </Modal>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        file={itemToPreview}
      />

      <MoveModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onConfirm={confirmMove}
        itemName={itemToMove?.name || ""}
        isMoving={isMoving}
      />

      {itemToShare && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          itemId={itemToShare.id}
          itemName={itemToShare.name}
          itemType={itemToShare.type}
        />
      )}
    </div>
  );
};

export default AllFiles;
