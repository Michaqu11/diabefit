import axios from "axios";
import { getProfileId, getToken } from "../store/sessionStorage";
import { SERVICE_AI_URL } from "../config/data";

export const trainModel = async (
  csvFile: File,
  jsonFile: File,
): Promise<any> => {
  const formData = new FormData();
  formData.append("csv_file", csvFile);
  formData.append("json_file", jsonFile);
  formData.append("id", getProfileId());
  formData.append("token", getToken() ?? "");

  try {
    const response = await axios.post(`${SERVICE_AI_URL}/train`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.error) {
      return undefined;
    }

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    return undefined;
  }
};
