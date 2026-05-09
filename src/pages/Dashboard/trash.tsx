import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid3X3, List, Home, Trash2, File, Folder, ChevronRight, RotateCcw } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  deletedDate: string;
  size: string;
  icon: React.ReactNode;
  isFavorite: boolean;
}

const Trash: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const trashFiles: FileItem[] = [
    {
      id: '1',
      name: 'old-project.zip',
      type: 'file',
      fileType: 'Archive',
      deletedDate: '2 days ago',
      size: '125.7 MB',
      icon: <File className="w-5 h-5 text-gray-500" />,
      isFavorite: false
    },
    {
      id: '2',
      name: 'temp-folder',
      type: 'folder',
      fileType: 'Folder',
      deletedDate: '3 days ago',
      size: '3.2 GB',
      icon: <Folder className="w-5 h-5 text-gray-500" />,
      isFavorite: false
    },
    {
      id: '3',
      name: 'draft-report.docx',
      type: 'file',
      fileType: 'Word',
      deletedDate: '1 week ago',
      size: '856 KB',
      icon: <File className="w-5 h-5 text-gray-500" />,
      isFavorite: false
    },
    {
      id: '4',
      name: 'backup-images',
      type: 'folder',
      fileType: 'Folder',
      deletedDate: '2 weeks ago',
      size: '8.9 GB',
      icon: <Folder className="w-5 h-5 text-gray-500" />,
      isFavorite: false
    },
    {
      id: '5',
      name: 'test-data.csv',
      type: 'file',
      fileType: 'CSV',
      deletedDate: '3 weeks ago',
      size: '2.1 MB',
      icon: <File className="w-5 h-5 text-gray-500" />,
      isFavorite: false
    }
  ];

  const handleRestore = (id: string) => {
    console.log('Restore item:', id);
    // Restore logic here
  };

  const handlePermanentDelete = (id: string) => {
    console.log('Permanent delete item:', id);
    // Permanent delete logic here
  };

  const handleEmptyTrash = () => {
    console.log('Empty trash');
    // Empty trash logic here
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="min-h-full flex" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

        {/* Main Content */}
        <div className="flex-1 flex flex-col py-2 gap-2">

          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="px-6 py-3 flex items-center space-x-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <Link to="/dashboard" className="cursor-pointer hover:opacity-80 transition-opacity">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Trash2 className="w-4 h-4" />
              <span style={{ color: 'var(--text-primary)' }}>Trash</span>
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
          <div className='flex justify-end px-6'>
            <button
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              onClick={handleEmptyTrash}
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Trash</span>
            </button>
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
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Deleted</th>
                      <th className="text-center p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trashFiles.map((file) => (
                      <tr className="border-b transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            {file.icon}
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{file.fileType}</td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{file.size}</td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>{file.deletedDate}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2 pl-2">
                            {/* Restore */}
                            <div className="w-6 flex justify-center">
                              <button
                                onClick={() => handleRestore(file.id)}
                                className="p-1.5 rounded transition-colors flex items-center justify-center"
                                style={{ color: 'var(--text-tertiary)' }}
                                title="Restore"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Permanent Delete */}
                            <div className="w-6 flex justify-center">
                              <button
                                onClick={() => handlePermanentDelete(file.id)}
                                className="p-1.5 rounded transition-colors flex items-center justify-center"
                                style={{ color: '#ef4444' }}
                                title="Delete permanently"
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
                {trashFiles.map((file) => (
                  <div key={file.id} className="rounded-lg border p-4 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                    <div className="flex flex-col items-center space-y-2">
                      {file.icon}
                      <span className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{file.size}</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{file.deletedDate}</span>
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

export default Trash;
