import axios from "axios";
import {
  getProfileId,
  getToken,
  saveSettingsInSessionStorage,
} from "../store/sessionStorage";
import { ISettings } from "../types/settings";
import { SERVICE_URL } from "../config/data";

export const saveSettings = async (settings: ISettings) => {
  const token = getToken()
  const { data } = await axios.post(
    `${SERVICE_URL}/settings`,
    {
      id: getProfileId(),
      settings: settings,
      token
    },
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
  saveSettingsInSessionStorage(settings);
  return data;
};
