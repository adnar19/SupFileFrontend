import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Upload, FolderPlus, Grid3X3, List, Home, Clock, Star, Trash2, HardDrive, File, Folder, Image, ChevronRight, Share2, User, LogOut, BarChart3, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

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

const Favorites: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const favoriteFiles: FileItem[] = [
    {
      id: '1',
      name: 'Projects',
      type: 'folder',
      fileType: 'Folder',
      modified: '1 day ago',
      size: '8.3 GB',
      icon: <Folder className="w-5 h-5 text-purple-500" />,
      isFavorite: true
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
      name: 'design.sketch',
      type: 'file',
      fileType: 'Sketch',
      modified: '4 days ago',
      size: '45.3 MB',
      icon: <File className="w-5 h-5 text-purple-500" />,
      isFavorite: true
    },
    {
      id: '4',
      name: 'contract.pdf',
      type: 'file',
      fileType: 'PDF',
      modified: '1 week ago',
      size: '3.2 MB',
      icon: <File className="w-5 h-5 text-red-500" />,
      isFavorite: true
    },
    {
      id: '5',
      name: 'portfolio-website',
      type: 'folder',
      fileType: 'Folder',
      modified: '2 weeks ago',
      size: '2.1 GB',
      icon: <Folder className="w-5 h-5 text-blue-500" />,
      isFavorite: true
    }
  ];

  const sidebarItems = [
    { icon: <File className="w-5 h-5" />, label: 'All Files', active: false, path: '/file-manager' },
    { icon: <Clock className="w-5 h-5" />, label: 'Recent', active: false, path: '/recent' },
    { icon: <Star className="w-5 h-5" />, label: 'Favorites', active: true, path: '/favorites' },
    { icon: <Trash2 className="w-5 h-5" />, label: 'Trash', active: false, path: '/trash' }
  ];

  const storageUsed = 45.7;
  const storageTotal = 100;

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

  const handleLogout = () => {
    // Logout logic here
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Sidebar */}
        <div className="w-64 p-6" style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
          <div className="space-y-6">
            {/* Logo */}
            <Link to="/file-manager" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="SupFile" className="w-8 h-8" />
              <span className="text-xl font-bold">SupFile</span>
            </Link>

            {/* Navigation */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: item.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: item.active ? 'var(--accent-color)' : 'var(--text-secondary)'
                  }}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Storage Indicator */}
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center space-x-2 mb-3">
                <HardDrive className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Storage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span>{storageUsed} GB used</span>
                  <span>{storageTotal} GB total</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="px-6 py-4" style={{ backgroundColor: 'var(--navbar-bg)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Favorite Files</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Search favorite files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                    style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Upload Button */}
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload</span>
                </button>

                {/* New Folder Button */}
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                  <FolderPlus className="w-4 h-4" />
                  <span className="text-sm font-medium">New Folder</span>
                </button>

                {/* Theme Toggle */}
                <button 
                  className="bg-transparent border rounded-lg p-1.5 cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2 z-50" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                      <Link
                        to="/account-settings"
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <User className="w-4 h-4" />
                        <span>Account</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Breadcrumb */}
          <div className="px-6 py-3 flex items-center space-x-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <Link to="/file-manager" className="cursor-pointer hover:opacity-80 transition-opacity">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Star className="w-4 h-4" />
            <span style={{ color: 'var(--text-primary)' }}>Favorite Files</span>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {/* View Toggle */}
            <div className="flex justify-end mb-4">
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
                    {favoriteFiles.map((file) => (
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
                                className={`p-1.5 rounded transition-colors flex items-center justify-center ${
                                  file.isFavorite ? 'text-yellow-500' : ''
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
                {favoriteFiles.map((file) => (
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

export default Favorites;
