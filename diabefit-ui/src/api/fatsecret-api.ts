import axios from "axios";

const SERVICE_URL = "https://diabefit.pythonanywhere.com/";

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
