import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Settings, Camera, Mail, Lock, AlertTriangle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const AccountSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleUploadAvatar = () => {
    console.log('Upload avatar');
    // Avatar upload logic here
  };

  const handleUpdateEmail = () => {
    console.log('Update email');
    // Email update logic here
  };

  const handleChangePassword = () => {
    console.log('Change password');
    // Password change logic here
  };

  const handleDeleteAccount = () => {
    console.log('Delete account');
    // Delete account logic here
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="px-6 py-4" style={{ backgroundColor: 'var(--navbar-bg)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Account Settings</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <button 
                  className="bg-transparent border rounded-lg p-1.5 cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
            </div>
          </header>

          {/* Breadcrumb */}
          <div className="px-6 py-3 flex items-center space-x-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <Link to="/file-manager" className="cursor-pointer hover:opacity-80 transition-opacity">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Settings className="w-4 h-4" />
            <span style={{ color: 'var(--text-primary)' }}>Account Settings</span>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Account Settings</h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Manage your profile and account preferences</p>
              </div>

              {/* Profile Picture Section */}
              <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Profile Picture</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Upload or change your avatar image</p>
                
                <div className="flex items-center space-x-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                      US
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Upload Info */}
                  <div className="flex-1">
                    <button
                      onClick={handleUploadAvatar}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-2"
                    >
                      Upload Avatar
                    </button>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>JPG, PNG or GIF. Max size 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Email Address Section */}
              <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Email Address</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Update your email address</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        type="email"
                        defaultValue="user@example.com"
                        disabled
                        className="w-full pl-10 pr-4 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--bg-tertiary)', 
                          borderColor: 'var(--border-color)', 
                          color: 'var(--text-tertiary)',
                          opacity: 0.7
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUpdateEmail}
                    className="px-4 py-2 rounded-lg border transition-colors"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Password Section */}
              <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Password</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Change your password</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border"
                        style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border"
                        style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border"
                        style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Account Section */}
              <div className="rounded-lg border p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: '#ef4444' }}>
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="w-5 h-5 mt-1" style={{ color: '#ef4444' }} />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: '#ef4444' }}>Delete Account</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Permanently delete your account and all data</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    This action cannot be undone. All your files, folders, and account data will be permanently deleted.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
