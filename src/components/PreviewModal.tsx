// File Preview Modal Component
import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText, Music, Download } from 'lucide-react';
import Modal from './Modal';
import { API_URL } from '../services/config';
import axios from 'axios';
import Cookies from 'js-cookie';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    type: 'file' | 'folder';
  } | null;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, file }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;

    if (isOpen && file && file.type === 'file') {
      const fetchFileContent = async () => {
        setLoading(true);
        setError(null);
        setTextContent(null);
        try {
          const token = Cookies.get('token');
          const ext = file.name.split('.').pop()?.toLowerCase();
          const isTextFile = ['txt', 'md'].includes(ext || '');

          const response = await axios.get(`${API_URL}/files/download/${file.id}`, {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (isTextFile) {
            const text = await response.data.text();
            setTextContent(text);
          } else {
            url = URL.createObjectURL(response.data);
            setBlobUrl(url);
          }
        } catch (err) {
          console.error("Error fetching file for preview:", err);
          setError("Failed to load preview");
        } finally {
          setLoading(false);
        }
      };

      fetchFileContent();
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
      setBlobUrl(null);
      setTextContent(null);
    };
  }, [isOpen, file, API_URL]);

  if (!file || file.type === 'folder') return null;

  const extension = file.name.split('.').pop()?.toLowerCase();
  const downloadUrl = `${API_URL}/files/download/${file.id}`;

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '');
  const isVideo = ['mp4', 'webm', 'ogg'].includes(extension || '');
  const isAudio = ['mp3', 'wav', 'ogg'].includes(extension || '');
  const isPdf = extension === 'pdf';
  const isText = ['txt', 'md'].includes(extension || '');

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[var(--text-tertiary)] animate-pulse">Loading preview...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-16 bg-red-500/5 rounded-xl border border-red-500/20 space-y-4">
          <FileText className="w-12 h-12 text-red-500/50" />
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => onClose()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Go back
          </button>
        </div>
      );
    }

    if (isText) {
      if (!textContent) return null;
      return (
        <div className="w-full h-[65vh] overflow-auto bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)] p-5">
          <pre className="text-sm text-[var(--text-primary)] whitespace-pre-wrap font-mono leading-relaxed">
            {textContent}
          </pre>
        </div>
      );
    }

    if (!blobUrl) return null;

    if (isImage) {
      return (
        <div className="flex items-center justify-center bg-black/5 rounded-lg overflow-hidden min-h-[300px]">
          <img 
            src={blobUrl} 
            alt={file.name} 
            className="max-w-full max-h-[70vh] object-contain shadow-lg"
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="bg-black rounded-lg overflow-hidden shadow-xl">
          <video 
            controls 
            autoPlay 
            className="w-full max-h-[70vh]"
          >
            <source src={blobUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-[var(--bg-tertiary)] rounded-xl space-y-6 border border-[var(--border-color)]">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shadow-inner">
            <Music className="w-10 h-10" />
          </div>
          <audio 
            controls 
            autoPlay 
            className="w-full max-w-md"
          >
            <source src={blobUrl} />
            Your browser does not support the audio element.
          </audio>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{file.name}</p>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="w-full h-[75vh] rounded-lg overflow-hidden border border-[var(--border-color)] shadow-lg">
          <iframe 
            src={`${blobUrl}#toolbar=0`} 
            className="w-full h-full"
            title={file.name}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[var(--bg-tertiary)] rounded-xl space-y-6 border border-[var(--border-color)] text-center">
        <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center text-[var(--text-tertiary)] border border-[var(--border-color)] shadow-sm">
          <FileText className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">Preview not available</h3>
          <p className="text-[var(--text-tertiary)] max-w-xs mx-auto">
            This file type ({extension}) cannot be previewed directly in the browser.
          </p>
        </div>
        <div className="flex items-center space-x-3 pt-2">
          <a 
            href={blobUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in New Tab</span>
          </a>
          <a 
            href={downloadUrl}
            className="flex items-center space-x-2 px-6 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-all font-medium border border-[var(--border-color)] shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={file.name}
      maxWidth="max-w-5xl"
    >
      <div className="py-2">
        {renderContent()}
      </div>
      <div className="mt-6 flex justify-between items-center px-1">
        <div className="flex items-center space-x-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
          <FileText className="w-3 h-3" />
          <span className="truncate max-w-[200px]">{file.name}</span>
        </div>
        <div className="flex items-center space-x-3">
          {blobUrl && (
            <a 
              href={blobUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors px-2 py-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Full View</span>
            </a>
          )}
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all shadow-md active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
