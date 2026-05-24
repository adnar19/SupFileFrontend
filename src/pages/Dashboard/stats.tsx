import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../services/config';
import { 
  BarChart3,
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileText, 
  Files,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { formatFileSize, getFileIcon } from '../../utils/fileUtils';
import { SyncLoader } from 'react-spinners';
import { useFileSystem } from '../../contexts/FileSystemContext';

interface DashboardStats {
  storage: {
    used: string;
    quota: string;
    distribution: {
      image: number;
      video: number;
      audio: number;
      document: number;
      other: number;
    };
  };
  recentFiles: any[];
}

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useFileSystem();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <SyncLoader color="#3b82f6" size={10} />
        <p className="text-[var(--text-tertiary)] animate-pulse font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

  const used = parseInt(stats.storage.used);
  const quota = parseInt(stats.storage.quota);
  const rawPercent = (used / quota) * 100;
  
  // Si le pourcentage est > 0 mais < 0.01%, on affiche "< 0.01"
  // Sinon on affiche avec 2 décimales si < 1%, ou on arrondit si >= 1%
  const percentUsed = rawPercent === 0 
    ? "0" 
    : rawPercent < 0.01 
      ? "< 0.01" 
      : rawPercent < 1 
        ? rawPercent.toFixed(2) 
        : Math.round(rawPercent).toString();

  const distribution = [
    { label: 'Images', value: stats.storage.distribution.image, color: 'bg-blue-500', icon: <FileImage className="w-4 h-4" /> },
    { label: 'Videos', value: stats.storage.distribution.video, color: 'bg-emerald-500', icon: <FileVideo className="w-4 h-4" /> },
    { label: 'Audio', value: stats.storage.distribution.audio, color: 'bg-amber-500', icon: <FileAudio className="w-4 h-4" /> },
    { label: 'Documents', value: stats.storage.distribution.document, color: 'bg-violet-500', icon: <FileText className="w-4 h-4" /> },
    { label: 'Other', value: stats.storage.distribution.other, color: 'bg-slate-500', icon: <Files className="w-4 h-4" /> },
  ].filter(d => d.value > 0 ); 

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      <div className="grid grid-cols-1 gap-6">
        {/* Storage Card */}
        <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold">Storage Distribution</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-blue-500">{percentUsed}%</p>
              <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase whitespace-nowrap">Used Capacity</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Multi-colored Stacked Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-[var(--text-secondary)]">Storage Capacity</span>
                <span className="text-sm font-bold">{formatFileSize(used)} used of {formatFileSize(quota)}</span>
              </div>
              <div className="w-full h-6 bg-[var(--bg-tertiary)] rounded-full overflow-hidden flex shadow-inner relative">
                {/* Background Track is rounded-full */}
                
                {/* Used Space segments wrapped in a rounded container */}
                <div 
                  className="h-full flex rounded-full overflow-hidden transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${used > 0 ? Math.max((used / quota) * 100, 1) : 0}%` }}
                >
                  {distribution.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`h-full ${item.color} transition-all duration-500 ease-out`} 
                      style={{ width: `${(item.value / used) * 100}%` }}
                      title={`${item.label}: ${formatFileSize(item.value)}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-4">
              {distribution.map((item, idx) => (
                <div key={idx} className="flex flex-col p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs font-bold text-[var(--text-secondary)] truncate">{item.label}</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-black">{formatFileSize(item.value)}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-bold mt-1">
                    {((item.value / used) * 100).toFixed(1)}% of used space
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Accès rapide</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.recentFiles.map((file, idx) => (
              <div 
                key={idx} 
                className="group p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3 h-3 text-blue-500" />
                </div>
                
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-300">
                    {getFileIcon('file', file.name)}
                  </div>
                  <div className="w-full">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1 font-medium">
                      {new Date(file.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {stats.recentFiles.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-[var(--bg-tertiary)]/30 rounded-2xl border border-dashed border-[var(--border-color)]">
                <Files className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
                <p className="text-sm text-[var(--text-tertiary)] font-medium">No recent files found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
