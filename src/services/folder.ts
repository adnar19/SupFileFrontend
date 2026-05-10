import axios from "axios";
import { API_URL } from "./config";
import Cookies from "js-cookie";

export const createFolder = async (name: string, parentId?: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.post(
      `${API_URL}/folders`,
      { name, parentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const getFolderContents = async (folderId: string = "root") => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/folders/${folderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching folder contents:", error);
    throw error;
  }
};

export const deleteFolder = async (id: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.delete(`${API_URL}/folders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

export const restoreFolder = async (id: string) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.put(`${API_URL}/folders/${id}/restore`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error restoring folder:", error);
    throw error;
  }
};
