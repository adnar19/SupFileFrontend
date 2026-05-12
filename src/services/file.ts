import axios from "axios";
import { API_URL } from "./config";
import Cookies from "js-cookie";

export const uploadFile = async (file: File, folderId: string) => {
  try {
    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("file", file);
    if (folderId && folderId !== "root") {
      formData.append("folderId", folderId);
    }

    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (id: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.delete(`${API_URL}/files/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const downloadFile = async (id: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/files/download/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const getTrash = async (page: number = 1, limit: number = 10) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/files/trash?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trash:", error);
    throw error;
  }
};

export const restoreFile = async (id: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.put(`${API_URL}/files/${id}/restore`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error restoring file:", error);
    throw error;
  }
};

export const deleteFilePermanently = async (id: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.delete(`${API_URL}/files/${id}/permanent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting file permanently:", error);
    throw error;
  }
};

export const getUserFiles = async (page: number = 1, limit: number = 20) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/files?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user files:", error);
    throw error;
  }
};

export const getRecentFiles = async () => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/files/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent files:", error);
    throw error;
  }
};

export const getFavoriteFiles = async (page: number = 1, limit: number = 10) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/favorites?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite files:", error);
    throw error;
  }
};

export const toggleFavoriteApi = async (id: string, type: 'file' | 'folder') => {
  try {
    const token = Cookies.get("token");
    const payload = type === 'folder' ? { folderId: id } : { fileId: id };
    const response = await axios.post(`${API_URL}/favorites/toggle`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const renameFileApi = async (id: string, name: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.put(`${API_URL}/files/${id}/rename`, { name }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error renaming file:", error);
    throw error;
  }
};

export const moveFileApi = async (id: string, parentId: string | null) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.put(`${API_URL}/files/${id}/move`, { folderId: parentId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error moving file:", error);
    throw error;
  }
};
