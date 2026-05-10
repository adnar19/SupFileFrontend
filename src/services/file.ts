import axios from "axios";
import { API_URL } from "./config";
import Cookies from "js-cookie";

export const uploadFile = async (file: File, folderId: string) => {
  try {
    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);

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
