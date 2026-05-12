import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { getFolderContents } from '../services/folder';
import { Folder, ChevronRight, Home, Check } from 'lucide-react';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';

interface FolderItem {
  id: string;
  name: string;
}

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetFolderId: string | null) => void;
  itemName: string;
  isMoving: boolean;
}

const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, onConfirm, itemName, isMoving }) => {
  const [currentId, setCurrentId] = useState<string | null>(null); // null = root
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string, name: string}[]>([]);

  const fetchFolders = async (id: string | null) => {
    try {
      setLoading(true);
      const res = await getFolderContents(id || "root", 1, 100);
      if (res.success) {
        setFolders(res.data.folders);
        if (id) {
            setBreadcrumbs(res.data.breadcrumbs || []);
        } else {
            setBreadcrumbs([]);
        }
      }
    } catch (error) {
      toast.error("Failed to load folders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFolders(currentId);
    }
  }, [isOpen, currentId]);

  const handleFolderClick = (id: string) => {
    setCurrentId(id);
  };

  const handleBackToRoot = () => {
    setCurrentId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Move "${itemName}" to...`}>
      <div className="flex flex-col h-[400px]">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-1 px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] overflow-x-auto text-sm">
          <button 
            onClick={handleBackToRoot}
            className={`flex items-center space-x-1 hover:text-blue-500 transition-colors ${!currentId ? 'text-blue-500 font-bold' : 'text-[var(--text-tertiary)]'}`}
          >
            <Home className="w-4 h-4" />
            <span>Root</span>
          </button>
          {breadcrumbs.map((bc) => (
            <React.Fragment key={bc.id}>
              <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" />
              <button 
                onClick={() => handleFolderClick(bc.id)}
                className={`hover:text-blue-500 transition-colors ${currentId === bc.id ? 'text-blue-500 font-bold' : 'text-[var(--text-tertiary)]'}`}
              >
                {bc.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Folder List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <SyncLoader color="#3b82f6" size={8} />
            </div>
          ) : folders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-2">
              <Folder className="w-12 h-12" />
              <p className="text-sm">No subfolders here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <Folder className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[var(--text-primary)] font-medium">{folder.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)] rounded-b-2xl">
          <div className="text-xs text-[var(--text-tertiary)]">
            Moving to: <span className="text-blue-500 font-bold">{currentId ? breadcrumbs[breadcrumbs.length - 1]?.name || "Folder" : "Root"}</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(currentId)}
              disabled={isMoving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
            >
              {isMoving ? (
                <SyncLoader color="#ffffff" size={4} />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Move Here</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MoveModal;
