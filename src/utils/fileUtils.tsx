import { 
  File, Folder, FileText, Image as ImageIcon, Video, Music, 
  Archive, Presentation, Table 
} from 'lucide-react';

export const getFileIcon = (type: string, name: string) => {
  if (type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />;

  const extension = name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return <ImageIcon className="w-5 h-5 text-green-500" />;
    case 'mp4':
    case 'mov':
    case 'webm': return <Video className="w-5 h-5 text-purple-500" />;
    case 'mp3':
    case 'wav':
    case 'ogg': return <Music className="w-5 h-5 text-pink-500" />;
    case 'zip':
    case 'rar':
    case '7z': return <Archive className="w-5 h-5 text-orange-500" />;
    case 'ppt':
    case 'pptx': return <Presentation className="w-5 h-5 text-orange-600" />;
    case 'xls':
    case 'xlsx': return <Table className="w-5 h-5 text-emerald-600" />;
    default: return <File className="w-5 h-5 text-slate-500" />;
  }
};

export const formatFileSize = (bytes: string | number) => {
  const b = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  if (isNaN(b) || b === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getCustomFileType = (mimeType: string, name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();
  let customType = mimeType?.split('/')[1]?.toUpperCase() || 'File';
  
  if (['doc', 'docx'].includes(extension || '')) customType = 'Word';
  if (['ppt', 'pptx'].includes(extension || '')) customType = 'PowerPoint';
  if (['xls', 'xlsx'].includes(extension || '')) customType = 'Excel';
  if (extension === 'pdf') customType = 'PDF';
  
  return customType;
};
