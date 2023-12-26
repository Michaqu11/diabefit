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
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
        "Access-Control-Allow-Headers": "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control",
        "Content-Type": "application/json",
      },
    },
  );
  saveLibreAPIInSessionStorage(libreAPI);
  return data;
};
