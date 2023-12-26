import axios from "axios";
import { SERVICE_URL } from "../config/data";


export const searchFood = async (foodName: string, pageNumber: number) => {
  const { data } = await axios.post(
    SERVICE_URL + `/search?name=${foodName}&page=${pageNumber}`,
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
  return data;
};
