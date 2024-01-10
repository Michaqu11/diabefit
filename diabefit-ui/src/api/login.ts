import axios from "axios";
import { IProfile } from "../types/profile";
import { getToken, saveData } from "../store/sessionStorage";
import { IAllData } from "../types/settings";
import { SERVICE_URL } from "../config/data";

const RETRY = 3;
const RETRY_DELAY = 2000;
const getData = async (uid: string, token: string) => {
  const { data } = await axios.post(
    `${SERVICE_URL}/login`,
    { id: uid, token: token },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
        "Access-Control-Allow-Headers":
          "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control",
        "Content-Type": "application/json",
      },
    },
  );
  return data;
};

export const account = async (profile: IProfile) => {
  const token = getToken();
  try {
    const data = await getData(profile.uid, token);
    saveData(data);
    return data as IAllData;
  } catch {
    let counter = 0;
    let data = null;

    while (!data && counter < RETRY) {
      try {
        data = (await new Promise((resolve, reject) => {
          setTimeout(async () => {
            resolve(getData(profile.uid, token));
          }, RETRY_DELAY);
        })) as IAllData;
      } catch {
        counter++;
      }
    }
    if (data) {
      saveData(data);
      return data;
    }

    return undefined;
  }
};
