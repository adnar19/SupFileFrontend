import React, { useState, useEffect } from 'react';
import { 
  Link, Copy, Check, Trash2, Lock, Calendar, Users, 
  UserMinus, Shield, Plus, Globe, Key, RefreshCw 
} from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { 
  createPublicLink, 
  deletePublicLink, 
  getMyPublicLinks, 
  shareFolderInternal, 
  removeInternalShare, 
  getFolderShares 
} from '../services/sharing';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
  itemType: 'file' | 'folder';
}

interface Collaborator {
  shareId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
  permission: 'READ' | 'WRITE';
  sharedAt: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, itemId, itemName, itemType }) => {
  const [activeTab, setActiveTab] = useState<'public' | 'internal'>('public');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // State for public sharing
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [useExpiry, setUseExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  // State for internal sharing
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [collabEmail, setCollabEmail] = useState('');
  const [collabPermission, setCollabPermission] = useState<'READ' | 'WRITE'>('READ');
  const [collabLoading, setCollabLoading] = useState(false);

  // Initialize and check if sharing links already exist
  const fetchShareStatus = async () => {
    if (!itemId) return;
    setLoading(true);
    try {
      // 1. Fetch public link if exists
      const publicLinksRes = await getMyPublicLinks();
      if (publicLinksRes.success) {
        // Find public link for this item
        const existingPublic = publicLinksRes.data.find(
          (link: any) => link.item?.id === itemId && link.type === itemType
        );
        if (existingPublic) {
          setPublicLink(existingPublic.link);
          setPublicToken(existingPublic.token);
          setUsePassword(existingPublic.isPasswordProtected);
          if (existingPublic.expiresAt) {
            setUseExpiry(true);
            setExpiryDate(new Date(existingPublic.expiresAt).toISOString().split('T')[0]);
          } else {
            setUseExpiry(false);
            setExpiryDate('');
          }
        } else {
          setPublicLink(null);
          setPublicToken(null);
          setUsePassword(false);
          setPassword('');
          setUseExpiry(false);
          setExpiryDate('');
        }
      }

      // 2. Fetch collaborators
      const collabRes = await getFolderShares(itemId, itemType);
      if (collabRes && collabRes.success) {
        setCollaborators(collabRes.data);
      }
    } catch (err: any) {
      console.error('Error fetching share status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchShareStatus();
      setActiveTab('public');
    }
  }, [isOpen, itemId, itemType]);

  const handleCreatePublicLink = async () => {
    setLoading(true);
    try {
      const payload: any = {
        itemId,
        type: itemType,
      };
      if (usePassword && password) {
        payload.password = password;
      }
      if (useExpiry && expiryDate) {
        // Set end of day
        payload.expiresAt = new Date(`${expiryDate}T23:59:59Z`).toISOString();
      }

      const res = await createPublicLink(payload);
      if (res.success) {
        setPublicLink(res.data.link);
        setPublicToken(res.data.token);
        toast.success('Public share link generated successfully!');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to generate public link';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokePublicLink = async () => {
    if (!publicToken) return;
    setLoading(true);
    try {
      const res = await deletePublicLink(publicToken);
      if (res.success) {
        setPublicLink(null);
        setPublicToken(null);
        setPassword('');
        setUsePassword(false);
        setUseExpiry(false);
        setExpiryDate('');
        toast.success('Public share link revoked');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to revoke public link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (publicLink) {
      navigator.clipboard.writeText(publicLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabEmail.trim()) return;
    setCollabLoading(true);
    try {
      const res = await shareFolderInternal(itemId, itemType, collabEmail.trim(), collabPermission);
      if (res.success) {
        toast.success(res.message || 'Collaborator added successfully');
        setCollabEmail('');
        // Refresh list
        const collabRefreshRes = await getFolderShares(itemId, itemType);
        if (collabRefreshRes.success) {
          setCollaborators(collabRefreshRes.data);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to share folder');
    } finally {
      setCollabLoading(false);
    }
  };

  const handleRemoveCollaborator = async (email: string) => {
    if (!window.confirm(`Are you sure you want to stop sharing with ${email}?`)) return;
    setCollabLoading(true);
    try {
      const res = await removeInternalShare(itemId, itemType, email);
      if (res.success) {
        toast.success(res.message || 'Collaborator removed');
        setCollaborators(collaborators.filter(c => c.user.email !== email));
        // Refresh list
        const collabRefreshRes = await getFolderShares(itemId, itemType);
        if (collabRefreshRes.success) {
          setCollaborators(collabRefreshRes.data);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove collaborator');
    } finally {
      setCollabLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${itemName}"`} maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Navigation Tabs (Available for both files and folders) */}
        <div className="flex border-b border-[var(--border-color)] p-0.5 bg-[var(--bg-tertiary)]/50 rounded-xl">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'public'
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public Link</span>
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'internal'
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Collaborators</span>
          </button>
        </div>

        {/* PUBLIC SHARING TAB */}
        {activeTab === 'public' && (
          <div className="space-y-4">
            {publicLink ? (
              // Active Public Share display
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-emerald-500 text-sm">Public Link is Active</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Anyone with the link can access and download this {itemType}.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block">
                    Share Link
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={publicLink}
                      className="flex-1 px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    disabled={loading}
                    onClick={handleRevokePublicLink}
                    className="flex items-center space-x-2 px-4 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Revoke Share Link</span>
                  </button>
                  {loading && <RefreshCw className="w-4 h-4 animate-spin text-[var(--text-tertiary)]" />}
                </div>
              </div>
              ) : (
              // Generate Share Link options
              <div className="space-y-5">
                <p className="text-sm text-[var(--text-secondary)]">
                  Create a public link to share this {itemType} with people outside your account.
                </p>

                {/* Password Configuration */}
                <div className="space-y-3 p-4 bg-[var(--bg-tertiary)]/30 border border-[var(--border-color)] rounded-xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">Password Protection</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={usePassword}
                      onChange={(e) => setUsePassword(e.target.checked)}
                      className="w-4 h-4 text-blue-500 border-[var(--border-color)] rounded focus:ring-blue-500"
                    />
                  </label>

                  {usePassword && (
                    <div className="relative mt-2">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-[var(--text-tertiary)]" />
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Expiry Date Configuration */}
                <div className="space-y-3 p-4 bg-[var(--bg-tertiary)]/30 border border-[var(--border-color)] rounded-xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">Expiration Date</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={useExpiry}
                      onChange={(e) => setUseExpiry(e.target.checked)}
                      className="w-4 h-4 text-blue-500 border-[var(--border-color)] rounded focus:ring-blue-500"
                    />
                  </label>

                  {useExpiry && (
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl outline-none focus:border-blue-500 transition-all"
                    />
                  )}
                </div>

                {/* Generate Link Trigger */}
                <button
                  disabled={loading || (usePassword && !password) || (useExpiry && !expiryDate)}
                  onClick={handleCreatePublicLink}
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <> 
                      <Link className="w-5 h-5" />
                      <span>Generate Public Link</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* COLLABORATORS TAB */}
        {activeTab === 'internal' && (
          <div className="space-y-5">
            {/* Add Collaborator Form */}
            <form onSubmit={handleAddCollaborator} className="space-y-3">
              <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block">
                Add Collaborator
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl outline-none focus:border-blue-500 transition-all"
                  required
                />
                <div className="flex gap-2 shrink-0">
                  <select
                    value={collabPermission}
                    onChange={(e) => setCollabPermission(e.target.value as 'READ' | 'WRITE')}
                    className="px-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl outline-none"
                  >
                    <option value="READ">Viewer</option>
                    <option value="WRITE">Editor</option>
                  </select>
                  <button
                    type="submit"
                    disabled={collabLoading || !collabEmail}
                    className="px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {collabLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </form>

            {/* List of Collaborators */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block">
                Who has access
              </label>

              {collaborators.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-[var(--border-color)] rounded-xl">
                  <Users className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-[var(--text-secondary)]">Only you have access to this {itemType}.</p>
                </div>
              ) : (
                <div className="border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)] max-h-48 overflow-y-auto bg-[var(--bg-tertiary)]/20">
                  {collaborators.map((c) => (
                    <div key={c.shareId} className="flex items-center justify-between p-3.5 hover:bg-[var(--bg-hover)] transition-all">
                      <div className="flex items-center space-x-3 min-w-0">
                        {c.user.avatarUrl ? (
                          <img
                            src={c.user.avatarUrl}
                            alt={c.user.fullName || c.user.email}
                            className="w-8 h-8 rounded-full object-cover border border-[var(--border-color)]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {(c.user.fullName || c.user.email).substring(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
                            {c.user.fullName || c.user.email}
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)] truncate">{c.user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] font-medium text-[var(--text-secondary)]">
                          <Shield className="w-3 h-3 opacity-70" />
                          <span>{c.permission === 'WRITE' ? 'Editor' : 'Viewer'}</span>
                        </span>
                        <button
                          onClick={() => handleRemoveCollaborator(c.user.email)}
                          disabled={collabLoading}
                          className="p-1 text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Revoke access"
                        >
                          <UserMinus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShareModal;
