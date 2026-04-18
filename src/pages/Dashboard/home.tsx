import React, { useState } from 'react';
import { Grid3X3, List, Home, Star, Trash2, File, Folder, Image, ChevronRight, Share2, BarChart3 } from 'lucide-react';


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

  const files: FileItem[] = [
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      fileType: 'Folder',
      modified: '2 hours ago',
      size: '12.5 GB',
      icon: <Folder className="w-5 h-5 text-blue-500" />,
      isFavorite: false
    },
    {
      id: '2',
      name: 'Projects',
      type: 'folder',
      fileType: 'Folder',
      modified: '1 day ago',
      size: '8.3 GB',
      icon: <Folder className="w-5 h-5 text-purple-500" />,
      isFavorite: true
    },
    {
      id: '3',
      name: 'Images',
      type: 'folder',
      fileType: 'Folder',
      modified: '3 days ago',
      size: '24.7 GB',
      icon: <Image className="w-5 h-5 text-green-500" />,
      isFavorite: false
    },
    {
      id: '4',
      name: 'report.pdf',
      type: 'file',
      fileType: 'PDF',
      modified: '5 hours ago',
      size: '2.4 MB',
      icon: <File className="w-5 h-5 text-red-500" />,
      isFavorite: false
    },
    {
      id: '5',
      name: 'presentation.pptx',
      type: 'file',
      fileType: 'PowerPoint',
      modified: '1 day ago',
      size: '15.7 MB',
      icon: <File className="w-5 h-5 text-orange-500" />,
      isFavorite: true
    }
  ];


  const toggleFavorite = (id: string) => {
    console.log('Toggle favorite for item:', id);
    // Toggle favorite logic here
  };

  const handleShare = (id: string) => {
    console.log('Share item:', id);
    // Share logic here
  };

  const handleDelete = (id: string) => {
    console.log('Delete item:', id);
    // Delete logic here
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="min-h-full flex" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>


        {/* Main Content */}
        <div className="flex-1 flex flex-col py-2">

          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="px-6 py-3 flex items-center space-x-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span style={{ color: 'var(--text-primary)' }}>My Files</span>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end px-6">
              <div className="flex items-center space-x-1 rounded-lg p-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'shadow-sm' : ''}`}
                  style={{ backgroundColor: viewMode === 'list' ? 'var(--card-bg)' : 'transparent' }}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
                  style={{ backgroundColor: viewMode === 'grid' ? 'var(--card-bg)' : 'transparent' }}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>


          {/* Content Area */}
          <div className="flex-1 p-6">


            {/* Files/Folders */}
            {viewMode === 'list' ? (
              <div className="rounded-lg border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Name</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Type</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Size</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Modified</th>
                      <th className="text-center p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr className="border-b transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            {file.icon}
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{file.fileType}</td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{file.size}</td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{file.modified}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2 pl-2">
                            {/* Share - uniquement pour les fichiers */}
                            <div className="w-6 flex justify-center">
                              {file.type === 'file' && (
                                <button
                                  onClick={() => handleShare(file.id)}
                                  className="p-1.5 rounded transition-colors flex items-center justify-center"
                                  style={{ color: 'var(--text-tertiary)' }}
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* Plot - pour tous les éléments */}
                            <div className="w-6 flex justify-center">
                              <button
                                onClick={() => console.log('Plot item:', file.id)}
                                className="p-1.5 rounded transition-colors flex items-center justify-center"
                                style={{ color: 'var(--text-tertiary)' }}
                              >
                                <BarChart3 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Favorite - pour tous les éléments */}
                            <div className="w-6 flex justify-center">
                              <button
                                onClick={() => toggleFavorite(file.id)}
                                className={`p-1.5 rounded transition-colors flex items-center justify-center ${file.isFavorite ? 'text-yellow-500' : ''
                                  }`}
                                style={{ color: file.isFavorite ? '#eab308' : 'var(--text-tertiary)' }}
                              >
                                <Star className="w-4 h-4" fill={file.isFavorite ? 'currentColor' : 'none'} />
                              </button>
                            </div>

                            {/* Delete - pour tous les éléments */}
                            <div className="w-6 flex justify-center">
                              <button
                                onClick={() => handleDelete(file.id)}
                                className="p-1.5 rounded transition-colors flex items-center justify-center"
                                style={{ color: 'var(--text-tertiary)' }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="rounded-lg border p-4 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                    <div className="flex flex-col items-center space-y-2">
                      {file.icon}
                      <span className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{file.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
