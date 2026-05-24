import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mail, Lock, AlertTriangle, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChangePassword, UpdateProfile, UploadAvatar } from '../../services/auth';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const AccountSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user?.fullName) {
      setName(user.fullName);
    }
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUploadAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    const data = await UploadAvatar(file);
    if (data?.success) {
      toast.success("Avatar updated successfully");
      refreshUser();
    }
  };

  const handleUpdateName = async () => {
    if (!user?.id) return;
    setIsUpdatingName(true);
    try {
      const data = await UpdateProfile(user.id, name, theme.toUpperCase(), email);
      if (data && data.success) {
        toast.success("Name updated successfully");
        refreshUser();
      }
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user?.id) return;
    setIsUpdatingEmail(true);
    try {
      const data = await UpdateProfile(user.id, name, theme.toUpperCase(), email);
      if (data && data.success) {
        toast.success("Email updated successfully");
        refreshUser();
      }
    } catch (error) {
      toast.error("Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdateTheme = async (newTheme: string) => {
    if (newTheme === theme) return;
    toggleTheme(); // This updates local state/context
    
    if (!user?.id) return;
    try {
      await UpdateProfile(user.id, name, newTheme.toUpperCase(), email);
      // We don't necessarily need to toast for theme change as it's immediate visually
    } catch (error) {
      console.error("Failed to persist theme preference");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      const data = await ChangePassword(currentPassword, newPassword, confirmNewPassword);
      if (data && data.success) {
        toast.success(data.message || "Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === "DELETE MY ACCOUNT") {
      setIsDeleting(true);
      setTimeout(() => {
        window.location.href = "/register";
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center space-x-3 text-red-500 mb-6">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Right to Erasure</h3>
            </div>

            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Pursuant to <strong>GDPR Article 17</strong>, you have the right to be forgotten. Your account will be deactivated immediately, and all your personal data and files will be <strong>permanently purged after a 30-day grace period</strong>.
            </p>

            <ul className="text-sm space-y-2 mb-8" style={{ color: 'var(--text-tertiary)' }}>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                Deactivation of your profile (immediate)
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                Permanent deletion of all data after 30 days
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                Right to cancel the request within 30 days
              </li>
            </ul>

            <div className="space-y-4">
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Type <span className="text-red-500 font-mono">DELETE MY ACCOUNT</span> to confirm:
              </label>
              <input
                type="text"
                placeholder="DELETE MY ACCOUNT"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 font-mono text-sm focus:ring-4 focus:ring-red-500/20 focus:outline-none transition-all uppercase"
                style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border font-semibold transition-colors dark:hover:bg-gray-800 hover:bg-gray-50"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirmation !== "DELETE MY ACCOUNT" || isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                >
                  {isDeleting ? "Processing..." : "Request Deletion"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Manage your profile and account preferences</p>
              </div>

              {/* Profile Information */}
              <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Update your name and profile picture</p>

                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold bg-blue-500 text-white shadow-lg border-4 border-white dark:border-gray-800">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      )}
                    </div>
                    <button
                      onClick={handleUploadAvatar}
                      type="button"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            style={{
                              backgroundColor: 'var(--bg-tertiary)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                        <button
                          onClick={handleUpdateName}
                          disabled={isUpdatingName}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 shrink-0 font-medium"
                        >
                          {isUpdatingName ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>This name will be visible to other users on shared files.</p>
                  </div>
                </div>
              </div>

              {/* Theme Preference */}
              <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Theme Preference</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Choose how SupFile looks to you</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => handleUpdateTheme('light')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    style={{ backgroundColor: theme === 'light' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-tertiary)' }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Light Mode</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Clean and bright interface</p>
                    </div>
                    {theme === 'light' && <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>}
                  </div>

                  <div
                    onClick={() => handleUpdateTheme('dark')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ${theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    style={{ backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-tertiary)' }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Easier on the eyes in low light</p>
                    </div>
                    {theme === 'dark' && <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>}
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Email Address</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Update your email address</p>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUpdateEmail}
                    disabled={isUpdatingEmail}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 shrink-0 font-medium"
                  >
                    {isUpdatingEmail ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </div>

              {/* Password */}
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
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-lg border p-6 transition-all" style={{ backgroundColor: 'var(--card-bg)', borderColor: '#ef4444' }}>
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="w-5 h-5 mt-1 text-red-500" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: '#ef4444' }}>Danger Zone</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your Right to Erasure (GDPR)</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Deleting your account will result in the permanent removal of all your personal data and files after a <strong>30-day grace period</strong>.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium border border-red-600 shadow-sm"
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
