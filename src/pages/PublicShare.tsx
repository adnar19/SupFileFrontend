import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldAlert, Lock, Unlock, Download, FileText, 
  Folder, HardDrive, ArrowLeft, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getPublicShareInfo, downloadPublicShare, type PublicShareInfo } from '../services/sharing';
import { formatFileSize } from '../utils/fileUtils';

const PublicShare: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareInfo, setShareInfo] = useState<PublicShareInfo | null>(null);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const fetchShareInfo = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicShareInfo(token);
      if (res.success) {
        setShareInfo(res.data);
        if (!res.data.isPasswordProtected) {
          setIsUnlocked(true);
        }
      } else {
        setError('Unable to load sharing details.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'This sharing link is invalid or has expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShareInfo();
  }, [token]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setDownloading(true);
    try {
      const blob = await downloadPublicShare(token, password || undefined);
      
      // Check if the blob is actually a JSON error (e.g. wrong password)
      if (blob.type === 'application/json') {
        const text = await blob.text();
        const parsed = JSON.parse(text);
        if (parsed.message) {
          toast.error(parsed.message);
          setDownloading(false);
          return;
        }
      }

      // Determine file name
      let fileName = 'download';
      if (shareInfo?.item?.name) {
        fileName = shareInfo.item.name;
        if (shareInfo.type === 'folder' && !fileName.endsWith('.zip')) {
          fileName += '.zip';
        }
      } else {
        fileName = shareInfo?.type === 'folder' ? 'shared_folder.zip' : 'shared_file';
      }

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
      if (shareInfo?.isPasswordProtected) {
        setIsUnlocked(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Download failed. Please check the password.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-white p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_45%)]" />
        <div className="relative flex flex-col items-center space-y-4">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-slate-400 font-medium animate-pulse">Loading shared files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_45%)]" />
        
        <div className="relative max-w-md w-full bg-slate-900/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Access Denied</h2>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">{error}</p>
          <div className="mt-8">
            <Link 
              to="/login" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl font-medium transition-all border border-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent_45%)]" />
      
      <div className="relative max-w-md w-full bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Brand header */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            SupFile
          </span>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
            Secure Cloud Sharing
          </p>
        </div>

        {shareInfo?.isPasswordProtected && !isUnlocked ? (
          // Password Form
          <form onSubmit={handleDownload} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Lock className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Password Required</h3>
              <p className="text-xs text-slate-400 mt-1">
                Shared by <span className="text-slate-300 font-medium">{shareInfo.owner}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Enter Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-100 text-sm rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={downloading || !password}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
            >
              {downloading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Unlock className="w-4.5 h-4.5" />
                  <span>Unlock & Download</span>
                </>
              )}
            </button>
          </form>
        ) : (
          // Item Info & Download Screen
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-950/40 rounded-3xl flex items-center justify-center mb-4 border border-slate-800 shadow-inner group">
                {shareInfo?.type === 'folder' ? (
                  <Folder className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <FileText className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-100 line-clamp-2 px-2">
                {shareInfo?.item?.name || 'Shared Item'}
              </h3>
              
              <span className="inline-flex items-center space-x-1.5 text-xs px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-slate-400 mt-3">
                <HardDrive className="w-3.5 h-3.5 opacity-70" />
                <span>
                  {shareInfo?.item?.size ? formatFileSize(parseInt(shareInfo.item.size)) : '--'}
                </span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span className="capitalize">{shareInfo?.type || 'file'}</span>
              </span>
            </div>

            {/* Owner Info Panel */}
            <div className="p-4 bg-slate-950/30 border border-slate-800/60 rounded-2xl flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {shareInfo?.owner.substring(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Shared by</p>
                <p className="text-sm font-semibold text-slate-300 truncate">{shareInfo?.owner}</p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 group active:scale-[0.98]"
            >
              {downloading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download {shareInfo?.type === 'folder' ? 'Folder (ZIP)' : 'File'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 text-center text-[10px] text-slate-500">
          Powered by SupFile. Secure end-to-end file sharing.
        </div>
      </div>
    </div>
  );
};

export default PublicShare;
