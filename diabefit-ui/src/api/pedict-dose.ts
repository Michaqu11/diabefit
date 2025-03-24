import axios from "axios";
import { getProfileId, getToken } from "../store/sessionStorage";
import { SERVICE_AI_URL } from "../config/data";

export const predictDose = async (
  model: string,
  glucose_pre: number,
  insulin: number,
  carbs: number,
  fats: number,
  prot: number,
  timestamp: string,
): Promise<any> => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${SERVICE_AI_URL}/predict`,
      {
        id: getProfileId(),
        token,
        model_data: model,
        glucose_pre,
        insulin,
        carbs,
        fats,
        prot,
        timestamp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.error) {
      return undefined;
    }

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    return undefined;
  }
};
