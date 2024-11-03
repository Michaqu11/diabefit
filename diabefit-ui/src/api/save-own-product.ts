import axios from "axios";
import { getProfileId, getToken } from "../store/sessionStorage";
import { PROXY_SERVER_URL } from "../config/data";
import { IMealElement } from "../types/meal";

export const saveOwnProduct = async (product: IMealElement) => {
  const token = getToken();
  const { data } = await axios.post(
    `${PROXY_SERVER_URL}/ownProduct`,
    {
      id: getProfileId(),
      ownProduct: product,
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return data;
};
