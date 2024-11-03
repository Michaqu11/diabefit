import axios from "axios";
import { getProfileId, getToken } from "../store/sessionStorage";
import { PROXY_SERVER_URL } from "../config/data";
import { IMealElement } from "../types/meal";

export const removeOwnProduct = async (displayName: string) => {
  const token = getToken();
  const { data } = await axios.delete(
    `${PROXY_SERVER_URL}/ownProduct?id=${getProfileId()}&displayName=${displayName}&token=${token}`,
  );

  return data.ownProduct as IMealElement[];
};
