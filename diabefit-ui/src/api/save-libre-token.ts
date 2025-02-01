import axios from "axios";
import {
  getProfileId,
  getToken,
  saveLibreAPIInSessionStorage,
} from "../store/sessionStorage";
import { PROXY_SERVER_URL } from "../config/data";
import { LibreData } from "../types/settings";

export const saveLibreToken = async (libreAPI: LibreData) => {
  const token = getToken();

  const { data } = await axios.post(
    `${PROXY_SERVER_URL}/libreData`,
    {
      id: getProfileId(),
      libreAPI: libreAPI,
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (data.error) {
    return new Error(data.error);
  }

  saveLibreAPIInSessionStorage(libreAPI);
  return data;
};
