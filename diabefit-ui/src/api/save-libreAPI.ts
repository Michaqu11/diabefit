import axios from "axios";
import {
  getProfileId,
  saveLibreAPIInSessionStorage,
} from "../store/sessionStorage";

const SERVICE_URL = "http://127.0.0.1:8000";

export const saveLibreAPI = async (libreAPI: string) => {
  const { data } = await axios.post(
    `${SERVICE_URL}/libreAPI`,
    {
      id: getProfileId(),
      libreAPI: libreAPI,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  );
  saveLibreAPIInSessionStorage(libreAPI);
  return data;
};
