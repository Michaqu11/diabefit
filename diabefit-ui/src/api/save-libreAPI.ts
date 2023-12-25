import axios from "axios";
import {
  getProfileId,
  getToken,
  saveLibreAPIInSessionStorage,
} from "../store/sessionStorage";
import { SERVICE_URL } from "../config/data";


export const saveLibreAPI = async (libreAPI: string) => {
  const token = getToken()
  const { data } = await axios.post(
    `${SERVICE_URL}/libreAPI`,
    {
      id: getProfileId(),
      libreAPI: libreAPI,
      token
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
