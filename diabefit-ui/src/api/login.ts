import axios from "axios";
import { getToken, saveData } from "../store/sessionStorage";
import { IAllData } from "../types/settings";
import { PROXY_SERVER_URL } from "../config/data";
import { User } from "firebase/auth";

const RETRY = 3;
const RETRY_DELAY = 2000;

const getData = async (uid: string, token: string) => {
  const { data } = await axios.post(
    `${PROXY_SERVER_URL}/login`,
    { id: uid, token: token },
    {
      headers: {
        "Content-Type": "application/json", // Ensuring JSON content type
      },
    },
  );
  return data;
};

export const account = async (profile: User) => {
  const token = getToken();
  if (token) {
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
  }
  return undefined;
};
