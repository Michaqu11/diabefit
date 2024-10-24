import axios from "axios";
import {
  getProfileId,
  getToken,
  saveLibreAPIInSessionStorage,
} from "../store/sessionStorage";
import { PROXY_SERVER_URL } from "../config/data";

export const saveLibreToken = async (libreAPI: string) => {
  const token = getToken();
  const { data } = await axios.post(
    `${PROXY_SERVER_URL}/libreToken`,
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
  saveLibreAPIInSessionStorage(libreAPI);
  return data;
};
