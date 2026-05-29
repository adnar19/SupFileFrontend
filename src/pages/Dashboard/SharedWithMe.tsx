import React, { useState, useEffect } from 'react';
import { File, Folder, User, Calendar, Shield, ExternalLink, RefreshCw, Download, Trash2, Link as LinkIcon, Users, X, AlertTriangle, Eye, Lock, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { PreviewModal } from '../../components/PreviewModal';
import { 
  getSharedWithMe, 
  getMyPublicLinks, 
  deletePublicLink, 
  getFolderShares, 
  removeInternalShare,
  updateInternalSharePermission,
  type SharedItem,
  type MyPublicLink, 
  type Collaborator 
} from '../../services/sharing';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatFileSize } from '../../utils/fileUtils';
import { downloadFile } from '../../services/file';
import { downloadFolderApi } from '../../services/folder';
import Cookies from 'js-cookie';
import Modal from '../../components/Modal';
import { jwtDecode } from 'jwt-decode';

const SharedWithMe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'public'>('received');
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [publicLinks, setPublicLinks] = useState<MyPublicLink[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string, name: string, type: 'file' | 'folder' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCollabs, setLoadingCollabs] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [previewFile, setPreviewFile] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const navigate = useNavigate();

  const fetchSharedItems = async () => {
    setLoading(true);
    try {
      const res = await getSharedWithMe();
      if (res.success) {
        setSharedItems(res.data);
        setTotalPages(Math.ceil(res.data.length / limit) || 1);
      } else {
        toast.error(res.message || 'Failed to load shared items');
      }
    } catch (err) {
      console.error('Error fetching shared items:', err);
      toast.error('An error occurred while fetching shared items');
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicLinks = async () => {
    setLoading(true);
    try {
      const res = await getMyPublicLinks();
      if (res.success) {
        setPublicLinks(res.data);
        setTotalPages(Math.ceil(res.data.length / limit) || 1);
      } else {
        toast.error(res.message || 'Failed to load public links');
      }
    } catch (err) {
      toast.error('An error occurred while fetching public links');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (arg1: any, name?: string, type?: 'file' | 'folder') => {
    // Accept either (id, name, type) or a SharedItem object
    let id: string;
    let itemName: string;
    let itemType: 'file' | 'folder';

    if (arg1 && typeof arg1 === 'object' && arg1.item) {
      const sharedItem: SharedItem = arg1 as SharedItem;
      id = sharedItem.item.id;
      itemName = sharedItem.item.name;
      itemType = sharedItem.type;
    } else {
      id = arg1 as string;
      itemName = name || 'download';
      itemType = type || 'file';
    }

    try {
      toast.info(`Preparing "${itemName}" for download...`);

      let blob: Blob;
      const fileName = itemType === 'file' ? itemName : `${itemName}.zip`;

      if (itemType === 'file') {
        blob = await downloadFile(id);
      } else {
        blob = await downloadFolderApi(id);
      }

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'download.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download file');
    }
  };

  const handleRevokeAccess = async (item: SharedItem) => {
    try {
      const token = Cookies.get('token'); 
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const currentUserEmail = decoded.email;

      setConfirmConfig({
        title: "Remove Access",
        message: `Are you sure you want to remove yourself from "${item.item.name}"?`,
        onConfirm: async () => {
          const response = await removeInternalShare(item.item.id, item.type, currentUserEmail);

          if (response.success) {
            toast.success('Access removed');
            fetchSharedItems();
          } else {
            toast.error(response.message || 'Failed to remove access');
          }
        }
      });
      setIsConfirmModalOpen(true);
    } catch (err) {
      toast.error('An error occurred while removing access');
    }
  };

  const handleRevokePublicLink = async (token: string) => {
    setConfirmConfig({
      title: "Revoke Public Link",
      message: "Are you sure you want to revoke this public link? It will no longer be accessible by anyone.",
      onConfirm: async () => {
        try {
          const response = await deletePublicLink(token);

          if (response.success) {
            toast.success('Public link revoked');
            fetchPublicLinks();
          } else {
            toast.error(response.message || 'Failed to revoke link');
          }
        } catch (err) {
          toast.error('An error occurred while revoking the public link');
        }
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleViewCollaborators = async (itemId: string, type: 'file' | 'folder', itemName: string) => {
    setSelectedItem({ id: itemId, name: itemName, type });
    setShowCollabModal(true);
    setLoadingCollabs(true);
    try {
      const res = await getFolderShares(itemId, type);
      if (res.success) {
        setCollaborators(res.data);
      }
    } catch (err) {
      toast.error('Failed to load collaborators');
    } finally {
      setLoadingCollabs(false);
    }
  };

  const handleUpdatePermission = async (shareId: string, newPermission: 'READ' | 'WRITE') => {
    if (!selectedItem) return;
    setLoadingCollabs(true);
    try {
      const res = await updateInternalSharePermission(shareId, newPermission);
      if (res.success) {
        toast.success(res.message || 'Permission updated');
        // Refresh collaborators list
        const collabRes = await getFolderShares(selectedItem.id, selectedItem.type);
        if (collabRes.success) {
          setCollaborators(collabRes.data);
        }
      } else {
        toast.error(res.message || 'Failed to update permission');
      }
    } catch (err) {
      toast.error('An error occurred while updating permission');
    } finally {
      setLoadingCollabs(false);
    }
  };

  const handleRemoveCollaborator = async (collab: Collaborator) => {
    if (!selectedItem) return;
    
    setConfirmConfig({
      title: "Revoke Access",
      message: `Are you sure you want to revoke access for ${collab.user.email}?`,
      onConfirm: async () => {
        const response = await removeInternalShare(selectedItem.id, selectedItem.type, collab.user.email);

        if (response.success) {
          toast.success('Collaborator removed');
          handleViewCollaborators(selectedItem.id, selectedItem.type, selectedItem.name);
        } else {
          toast.error(response.message || 'Failed to remove collaborator');
        }
      }
    });
    setIsConfirmModalOpen(true);
  };

  // No search/filters in SharedWithMe — return the raw list for current tab
  const getFilteredItems = () => {
    return activeTab === 'received' ? sharedItems : publicLinks;
  };

  useEffect(() => {
    if (activeTab === 'received') {
      fetchSharedItems();
    } else {
      fetchPublicLinks();
    }
  }, [activeTab]);

  const handleTabChange = (tab: 'received' | 'public') => {
    if (tab !== activeTab) {
      setCurrentPage(1);
      setActiveTab(tab);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tabs and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex p-1 bg-[var(--bg-tertiary)]/50 rounded-xl w-fit">
        <button
          onClick={() => handleTabChange('received')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'received' 
              ? 'bg-[var(--card-bg)] text-blue-500 shadow-sm' 
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Shared with me</span>
        </button>
        <button
          onClick={() => handleTabChange('public')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'public' 
              ? 'bg-[var(--card-bg)] text-blue-500 shadow-sm' 
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Public Links</span>
        </button>
        </div>

        <button 
          onClick={() => {
            setCurrentPage(1);
            activeTab === 'received' ? fetchSharedItems() : fetchPublicLinks();
          }}
          className="p-2.5 bg-[var(--bg-tertiary)]/50 text-[var(--text-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
          title="Refresh list"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search and filters are disabled on this page (available only in My Drive and All Files) */}

      {activeTab === 'received' && sharedItems.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-2xl border border-dashed border-[var(--border-color)]">
          <User className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Nothing shared with you yet</h3>
          <p className="text-[var(--text-secondary)] mt-2">Files and folders shared with you by others will appear here.</p>
        </div>
      ) : activeTab === 'public' && publicLinks.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-2xl border border-dashed border-[var(--border-color)]">
          <LinkIcon className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">No public links</h3>
          <p className="text-[var(--text-secondary)] mt-2">Public links you create for your files will appear here.</p>
        </div>
      ) : (
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {activeTab === 'received' ? (
            <>
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/30">
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Shared By</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Date Shared</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Permission</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
              {(getFilteredItems() as SharedItem[]).slice((currentPage - 1) * limit, currentPage * limit).map((item: SharedItem, index: number) => (
              <tr key={index} className="hover:bg-[var(--bg-hover)] transition-all group cursor-default">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg shrink-0 ${item.type === 'folder' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {item.type === 'folder' ? <Folder className="w-5 h-5" /> : <File className="w-5 h-5" />}
                    </div>
                    <span className="font-medium text-[var(--text-primary)] truncate max-w-[200px]" title={item.item.name}>
                      {item.item.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                  {item.type === 'file' && item.item.size 
                    ? formatFileSize(parseInt(item.item.size)) 
                    : '--'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] text-xs font-bold border border-[var(--border-color)]">
                      {item.sharedBy.fullName?.substring(0, 2).toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.sharedBy.fullName}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{item.sharedBy.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-[var(--text-secondary)]">
                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                    {new Date(item.sharedAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    item.permission === 'WRITE' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {item.permission === 'WRITE' ? 'Editor' : 'Viewer'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Remove Access"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRevokeAccess(item);
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-[var(--text-tertiary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                      title="Download"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-[var(--text-tertiary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                      title="Open"
                      onClick={() => {
                        if (item.type === 'folder') {
                          navigate(`/folder/${item.item.id}`);
                        } else {
                          setPreviewFile({ id: item.item.id, name: item.item.name, type: 'file' });
                        }
                      }}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
            </>
          ) : (
            <>
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/30">
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-center">Views</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {(getFilteredItems() as MyPublicLink[]).slice((currentPage - 1) * limit, currentPage * limit).map((link: MyPublicLink, idx: number) => (
                <tr key={idx} className="hover:bg-[var(--bg-hover)] transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${link.type === 'folder' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {link.type === 'folder' ? <Folder className="w-4 h-4" /> : <File className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{link.item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center space-x-1 text-sm text-[var(--text-secondary)]">
                      <Eye className="w-4 h-4 opacity-50" />
                      <span>{link.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      {link.isPasswordProtected && (
                        <span className="p-1 rounded-md bg-amber-500/10 text-amber-500" title="Password Protected">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {link.expiresAt && (
                        <span 
                          className={`p-1 rounded-md ${new Date(link.expiresAt) < new Date() ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`} 
                          title={new Date(link.expiresAt) < new Date() ? "Expired" : `Expires on ${new Date(link.expiresAt).toLocaleDateString()}`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-2 text-[var(--text-tertiary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        onClick={() => handleViewCollaborators(link.item.id, link.type, link.item.name)}
                        title="View Collaborators"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        onClick={() => handleRevokePublicLink(link.token)}
                        title="Revoke Public Link"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </>
          )}
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]/10">
          <div className="text-sm text-[var(--text-tertiary)]">
            Page <span className="font-medium text-[var(--text-primary)]">{currentPage}</span> sur <span className="font-medium text-[var(--text-primary)]">{totalPages}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-[var(--border-color)]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-[var(--border-color)]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      </div>
      )}

      <PreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

      {/* Collaborators Modal */}
      {showCollabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Collaborators</h2>
                <p className="text-sm text-[var(--text-tertiary)] truncate max-w-[300px]">{selectedItem?.name}</p>
              </div>
              <button 
                onClick={() => setShowCollabModal(false)}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto">
              {loadingCollabs ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-[var(--text-tertiary)]" />
                </div>
              ) : collaborators.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 mx-auto mb-2 text-[var(--text-tertiary)] opacity-20" />
                  <p className="text-[var(--text-secondary)]">No internal collaborators yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {collaborators.map((collab) => (
                    <div key={collab.shareId} className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)]/30 rounded-xl border border-[var(--border-color)]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
                          {collab.user.avatarUrl ? (
                            <img src={collab.user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            collab.user.fullName?.substring(0, 2).toUpperCase() || '?'
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{collab.user.fullName}</p>
                          <p className="text-xs text-[var(--text-tertiary)] truncate">{collab.user.email}</p>
                          <select
                            value={collab.permission}
                            onChange={(e) => handleUpdatePermission(collab.shareId, e.target.value as 'READ' | 'WRITE')}
                            className="mt-1 text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-md border-none outline-none cursor-pointer hover:bg-blue-500/20 transition-all"
                          >
                            <option value="READ">READ</option>
                            <option value="WRITE">WRITE</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveCollaborator(collab)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Revoke Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-[var(--bg-tertiary)]/50 border-t border-[var(--border-color)] flex justify-end">
              <button 
                onClick={() => setShowCollabModal(false)}
                className="px-6 py-2 bg-[var(--bg-primary)] text-[var(--text-primary)] font-medium rounded-xl hover:bg-[var(--bg-hover)] border border-[var(--border-color)] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={confirmConfig?.title || "Confirm Action"}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-500">Action Required</p>
          </div>
          <p className="text-sm text-[var(--text-primary)]">
            {confirmConfig?.message}
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (confirmConfig) {
                  await confirmConfig.onConfirm();
                  setIsConfirmModalOpen(false);
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SharedWithMe;
