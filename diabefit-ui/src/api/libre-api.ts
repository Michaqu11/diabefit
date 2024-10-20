import axios from "axios";
import { getLibreAPI } from "../store/sessionStorage";
import { LIBRE_API_URL } from "../config/data";

export const getLibreData = async () => {
  const token = getLibreAPI();

  const { data } = await axios.get(LIBRE_API_URL, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
      "Access-Control-Allow-Headers":
        "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      version: "4.7.0",
      product: "llu.android",
    },
  });
  const infromation = data.data[0] ? data.data[0] : null;
  if (!infromation) return infromation;
  return infromation?.glucoseItem?.Value ?? null;
};
