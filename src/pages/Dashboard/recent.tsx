import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid3X3, List, Home, Clock, Star, Trash2, File, ChevronRight, Share2, BarChart3 } from 'lucide-react';


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

const Recent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const recentFiles: FileItem[] = [
    {
      id: '1',
      name: 'report.pdf',
      type: 'file',
      fileType: 'PDF',
      modified: '5 hours ago',
      size: '2.4 MB',
      icon: <File className="w-5 h-5 text-red-500" />,
      isFavorite: false
    },
    {
      id: '2',
      name: 'presentation.pptx',
      type: 'file',
      fileType: 'PowerPoint',
      modified: '1 day ago',
      size: '15.7 MB',
      icon: <File className="w-5 h-5 text-orange-500" />,
      isFavorite: true
    },
    {
      id: '3',
      name: 'budget.xlsx',
      type: 'file',
      fileType: 'Excel',
      modified: '2 days ago',
      size: '856 KB',
      icon: <File className="w-5 h-5 text-green-500" />,
      isFavorite: false
    },
    {
      id: '4',
      name: 'meeting-notes.docx',
      type: 'file',
      fileType: 'Word',
      modified: '3 days ago',
      size: '1.2 MB',
      icon: <File className="w-5 h-5 text-blue-500" />,
      isFavorite: false
    },
    {
      id: '5',
      name: 'design.sketch',
      type: 'file',
      fileType: 'Sketch',
      modified: '4 days ago',
      size: '45.3 MB',
      icon: <File className="w-5 h-5 text-purple-500" />,
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
        {/* Sidebar */}


        {/* Main Content */}
        <div className="flex-1 flex flex-col py-2">
          <div className="flex justify-between items-center">
            {/* Breadcrumb */}
            <div className="px-6 py-3 flex items-center space-x-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <Link to="/file-manager" className="cursor-pointer hover:opacity-80 transition-opacity">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Clock className="w-4 h-4" />
              <span style={{ color: 'var(--text-primary)' }}>Recent Files</span>
            </div>


            {/* View Toggle */}

            <div className="flex items-center space-x-1 rounded-lg p-1 mx-6" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
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
                    {recentFiles.map((file) => (
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
                            {/* Share */}
                            <div className="w-6 flex justify-center">
                              <button
                                onClick={() => handleShare(file.id)}
                                className="p-1.5 rounded transition-colors flex items-center justify-center"
                                style={{ color: 'var(--text-tertiary)' }}
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Plot */}
                            <div className="w-6 flex justify-center">
                              <button
                                onClick={() => console.log('Plot item:', file.id)}
                                className="p-1.5 rounded transition-colors flex items-center justify-center"
                                style={{ color: 'var(--text-tertiary)' }}
                              >
                                <BarChart3 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Favorite */}
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

                            {/* Delete */}
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
                {recentFiles.map((file) => (
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

export default Recent;
