import axios from "axios";
import { getProfileId, getToken } from "../store/sessionStorage";
import { PROXY_SERVER_URL } from "../config/data";
import { IMealElement } from "../types/meal";

export const getOwnProduct = async () => {
  const token = getToken();
  const { data } = await axios.get(
    `${PROXY_SERVER_URL}/ownProduct?id=${getProfileId()}&token=${token}`,
  );

  return data.ownProduct as IMealElement[];
};
