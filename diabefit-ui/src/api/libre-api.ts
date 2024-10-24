import axios from "axios";
import { getLibreAPI } from "../store/sessionStorage";
import { PROXY_SERVER_URL } from "../config/data";

export const getLibreData = async () => {
  const token = getLibreAPI();

  const { data } = await axios.get(
    PROXY_SERVER_URL + `/glucose?token=${token}`,
  );
  const infromation = data.data[0] ? data.data[0] : null;
  if (!infromation) return infromation;
  return infromation?.glucoseItem?.Value ?? null;
};
