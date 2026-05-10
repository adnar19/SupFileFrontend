import React, { createContext, useContext, useState, ReactNode } from "react";

interface FileSystemContextType {
  currentFolderId: string | undefined;
  setCurrentFolderId: (id: string | undefined) => void;
  currentFolderName: string | undefined;
  setCurrentFolderName: (name: string | undefined) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [currentFolderName, setCurrentFolderName] = useState<string | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <FileSystemContext.Provider value={{ 
      currentFolderId, 
      setCurrentFolderId, 
      currentFolderName, 
      setCurrentFolderName, 
      refreshTrigger, 
      triggerRefresh 
    }}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error("useFileSystem must be used within a FileSystemProvider");
  }
  return context;
};
