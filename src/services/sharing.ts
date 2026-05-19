import axios from "axios";
import { API_URL } from "./config";
import Cookies from "js-cookie";

export interface PublicShareCreatePayload {
  itemId: string;
  type: "file" | "folder";
  expiresAt?: string;
  password?: string;
}

export interface PublicShareInfo {
  isPasswordProtected: boolean;
  type?: "file" | "folder";
  item?: {
    id: string;
    name: string;
    size?: string;
    mimeType?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  owner: string;
}

export interface MyPublicLink {
  id: string;
  token: string;
  link: string;
  type: "file" | "folder";
  item: {
    id: string;
    name: string;
    mimeType?: string;
  };
  isPasswordProtected: boolean;
  expiresAt: string | null;
  views: number;
  createdAt: string;
}

export const createPublicLink = async (payload: PublicShareCreatePayload) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.post(`${API_URL}/share/public/create`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating public link:", error);
    throw error;
  }
};

export const deletePublicLink = async (shareToken: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.delete(`${API_URL}/share/public/${shareToken}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error revoking public link:", error);
    throw error;
  }
};

export const getMyPublicLinks = async () => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/share/public/my-links`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error listing public links:", error);
    throw error;
  }
};

export const getPublicShareInfo = async (shareToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/share/public/${shareToken}`);
    return response.data;
  } catch (error) {
    console.error("Error getting public share info:", error);
    throw error;
  }
};

export const downloadPublicShare = async (shareToken: string, password?: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/share/public/${shareToken}/download`,
      { password },
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error("Error downloading public share:", error);
    throw error;
  }
};

export const shareFolderInternal = async (folderId: string, email: string, permission: "READ" | "WRITE" = "READ") => {
  try {
    const token = Cookies.get("token");
    const response = await axios.post(
      `${API_URL}/share/internal`,
      { folderId, email, permission },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sharing folder internally:", error);
    throw error;
  }
};

export const removeInternalShare = async (folderId: string, email: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.delete(`${API_URL}/share/internal`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { folderId, email },
    });
    return response.data;
  } catch (error) {
    console.error("Error revoking internal share:", error);
    throw error;
  }
};

export const getSharedWithMe = async () => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/share/internal/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error listing folders shared with me:", error);
    throw error;
  }
};

export const getFolderShares = async (folderId: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/share/internal/${folderId}/shares`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error listing folder shares:", error);
    throw error;
  }
};
