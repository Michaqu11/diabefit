import axios from "axios";
import { PROXY_SERVER_URL } from "../config/data";

export const searchFood = async (foodName: string, pageNumber: number) => {
  const { data } = await axios.post(
    PROXY_SERVER_URL + `/food`,
    { foodName, pageNumber: `${pageNumber}` },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return data;
};
