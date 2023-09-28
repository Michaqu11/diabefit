import axios from "axios";

const SERVICE_URL = 'https://michaqu.pythonanywhere.com/'

export const searchFood = async (foodName: string, pageNumber: number) => {
  const { data } =  await axios.get(SERVICE_URL+`search?name=${foodName}&page=${pageNumber}`, {headers : {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }})
  debugger
  return data
};

