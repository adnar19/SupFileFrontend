import React, { useState, useEffect } from 'react';
import { File, Folder, User, Calendar, Shield, ExternalLink, RefreshCw, Download } from 'lucide-react';
import { getSharedWithMe, type SharedItem } from '../../services/sharing';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatFileSize } from '../../utils/fileUtils';
import { downloadFile } from '../../services/file'; // Assuming this exists for internal files

const SharedWithMe: React.FC = () => {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSharedItems = async () => {
    setLoading(true);
    try {
      const res = await getSharedWithMe();
      if (res.success) {
        setSharedItems(res.data);
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

  const handleDownload = async (item: SharedItem) => {
    if (item.type !== 'file') return;
    try {
      toast.info(`Downloading ${item.item.name}...`);
      const blob = await downloadFile(item.item.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.item.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      // ... (rest of download logic)
    } catch (err) {
      toast.error('Failed to download file');
    }
  };

  useEffect(() => {
    fetchSharedItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  if (sharedItems.length === 0) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
<div className="text-center py-12 bg-[var(--bg-secondary)] rounded-2xl border border-dashed border-[var(--border-color)]">
        <User className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Nothing shared with you yet</h3>
        <p className="text-[var(--text-secondary)] mt-2">Files and folders shared with you by others will appear here.</p>
      </div>
      </div>

      
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Shared with me</h1>
          <p className="text-[var(--text-tertiary)] text-sm">Files and folders shared with you by other users</p>
        </div>
        <button 
          onClick={fetchSharedItems}
          className="p-2.5 bg-[var(--bg-tertiary)]/50 text-[var(--text-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
          title="Refresh list"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
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
            {sharedItems.map((item, index) => (
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
                    {item.type === 'file' && (
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
                    )}
                    <button 
                      className="p-2 text-[var(--text-tertiary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                      title="Open"
                      onClick={() => {
                        if (item.type === 'folder') {
                          navigate(`/folder/${item.item.id}`);
                        } else {
                          toast.info(`Previewing ${item.item.name}...`);
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
        </table>
      </div>
      </div>
    </div>
  );
};

export default SharedWithMe;
