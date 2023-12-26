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
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
        "Access-Control-Allow-Headers": "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control",
        "Content-Type": "application/json",
      },
    },
  );
  saveData(data);
  return data as IAllData;
};
