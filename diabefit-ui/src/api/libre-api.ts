import axios from "axios";
import { getLibreAPI } from "../store/sessionStorage";
import { PROXY_SERVER_URL } from "../config/data";

export const getLibreData = async () => {
  const libreData = getLibreAPI();

  const { data } = await axios.post(PROXY_SERVER_URL + `/glucose`, {
    libreAPI: libreData,
  });

  const information = data.data[0] ? data.data[0] : null;
  if (!information) return information;
  return information?.glucoseItem?.Value ?? null;
};
