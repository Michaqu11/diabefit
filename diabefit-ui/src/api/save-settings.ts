import axios from "axios";
import {
  getProfileId,
  saveSettingsInSessionStorage,
} from "../store/sessionStorage";
import { ISettings } from "../types/settings";

const SERVICE_URL = "http://127.0.0.1:8000";

export const saveSettings = async (settings: ISettings) => {
  const { data } = await axios.post(
    `${SERVICE_URL}/settings`,
    {
      id: getProfileId(),
      settings: settings,
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
