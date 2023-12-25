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
        "Content-Type": "application/json",
      },
    },
  );
  saveSettingsInSessionStorage(settings);
  return data;
};
