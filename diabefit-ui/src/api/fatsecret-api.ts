import axios from "axios";
import { SERVICE_URL } from "../config/data";


export const searchFood = async (foodName: string, pageNumber: number) => {
  const { data } = await axios.post(
    SERVICE_URL + `search?name=${foodName}&page=${pageNumber}`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  );
  return data;
};
