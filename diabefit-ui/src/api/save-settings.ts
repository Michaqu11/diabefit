import axios from "axios";
import {
  getProfileId,
  getToken,
  saveSettingsInSessionStorage,
} from "../store/sessionStorage";
import { ISettings } from "../types/settings";
import { PROXY_SERVER_URL } from "../config/data";

export const saveSettings = async (settings: ISettings) => {
  const token = getToken();
  const { data } = await axios.post(
    `${PROXY_SERVER_URL}/saveSettings`,
    {
      id: getProfileId(),
      settings: settings,
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  saveSettingsInSessionStorage(settings);
  return data;
};
