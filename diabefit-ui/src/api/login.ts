import axios from "axios";
import { IProfile } from "../types/profile";
import { saveData } from "../store/sessionStorage";

const SERVICE_URL = "http://127.0.0.1:8000";

export const account = async (profile: IProfile) => {
  const { data } = await axios.post(
    `${SERVICE_URL}/login`,
    { id: profile.id },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  );
  saveData(data);
  return data;
};
