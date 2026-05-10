import React, { useState, useEffect } from 'react';
import { Grid3X3, List, Home, Star, Trash2, File, Folder, Image, ChevronRight, Share2, BarChart3, FileText, Music, Video, Archive } from 'lucide-react';
import { getFolderContents } from '../../services/folder';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';

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
  
  const { currentFolderId, setCurrentFolderId, currentFolderName, setCurrentFolderName, refreshTrigger } = useFileSystem();

  const getIcon = (type: string, name: string) => {
    if (type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />;
    
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Image className="w-5 h-5 text-green-500" />;
      case 'mp4':
      case 'mov': return <Video className="w-5 h-5 text-purple-500" />;
      case 'mp3':
      case 'wav': return <Music className="w-5 h-5 text-pink-500" />;
      case 'zip':
      case 'rar': return <Archive className="w-5 h-5 text-orange-500" />;
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getFolderContents(currentFolderId || "root");
      if (res.success) {
        const { folders, files, breadcrumbs: bc, currentFolder } = res.data;
        
        // Update current folder info
        if (currentFolder) {
            setCurrentFolderName(currentFolder.name);
            if (!currentFolderId) {
                setCurrentFolderId(currentFolder.id);
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
          isFavorite: f.isFavorited
        }));

        const fileItems: FileItem[] = files.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'file',
          fileType: f.mimeType?.split('/')[1]?.toUpperCase() || 'File',
          modified: new Date(f.createdAt).toLocaleDateString(),
          size: formatSize(f.size),
          icon: getIcon('file', f.name),
          isFavorite: f.isFavorited
        }));

        setItems([...folderItems, ...fileItems]);
        setBreadcrumbs(bc);
      }
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentFolderId, refreshTrigger]);

  const handleHomeClick = () => {
    setCurrentFolderId(undefined);
    setCurrentFolderName(undefined);
  };

  const handleFolderClick = (id: string) => {
    setCurrentFolderId(id);
  };

  const toggleFavorite = (id: string) => {
    console.log('Toggle favorite for item:', id);
  };

  const handleShare = (id: string) => {
    console.log('Share item:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete item:', id);
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="min-h-full flex flex-col">
        
        {/* Header with Breadcrumbs and View Toggle */}
        <div className="flex items-center justify-between px-6 py-4">
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

          <div className="flex items-center space-x-1 rounded-lg p-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-[var(--card-bg)] shadow-sm' : 'hover:bg-[var(--bg-secondary)]'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-[var(--card-bg)] shadow-sm' : 'hover:bg-[var(--bg-secondary)]'}`}
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
            <div className="rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Name</th>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Type</th>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Size</th>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Modified</th>
                    <th className="text-center p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Actions</th>
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
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-1">
                          {item.type === 'file' && (
                            <button onClick={() => handleShare(item.id)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-blue-500 transition-all">
                              <Share2 className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-green-500 transition-all">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toggleFavorite(item.id)} 
                            className={`p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all ${item.isFavorite ? 'text-yellow-500' : 'text-[var(--text-tertiary)] hover:text-yellow-500'}`}
                          >
                            <Star className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-red-500 transition-all">
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
                  onClick={() => item.type === 'folder' && handleFolderClick(item.id)}
                  className="flex flex-col items-center p-4 rounded-xl border hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                >
                  <div className="mb-3 transform group-hover:scale-110 transition-transform">
                    {React.cloneElement(item.icon as React.ReactElement, { className: 'w-12 h-12' })}
                  </div>
                  <span className="text-sm font-medium text-center truncate w-full mb-1" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.type === 'folder' ? item.fileType : item.size}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
