import axios from "axios";
import { IProfile } from "../types/profile";
import { getToken, saveData } from "../store/sessionStorage";
import { IAllData } from "../types/settings";
import { SERVICE_URL } from "../config/data";

export const account = async (profile: IProfile) => {
  const token = getToken()
  const { data } = await axios.post(
    `${SERVICE_URL}/login`,
    { id: profile.uid, token: token },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  );
  saveData(data);
  return data as IAllData;
};
