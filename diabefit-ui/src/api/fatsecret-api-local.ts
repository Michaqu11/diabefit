import axios from "axios";
import OAuth from "oauth-1.0a";
import * as CryptoJS from "crypto-js";

const oauth = new OAuth({
  consumer: {
    key: "a10b021da4fa4e4abaf91c1f047ea9c6",
    secret: "712c2646d33a48caa69ddb4a5574febf",
  },
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    const hmac = CryptoJS.HmacSHA1(baseString, key);
    return CryptoJS.enc.Base64.stringify(hmac);
  },
});

const requestData = (method: string, params: any) => {
  return {
    url: "https://platform.fatsecret.com/rest/server.api",
    method: "GET",
    data: {
      method: method,
      format: "json",
      oauth_signature_method: "HMAC-SHA1",
      max_results: "50",
      ...params,
    },
  };
};

export const searchFood = async (foodName: string, pageNumber: number) => {
  const data = requestData("foods.search.v2", {
    search_expression: foodName,
    page_number: pageNumber,
  });
  const params = oauth.authorize(data);

  return axios({
    method: data.method,
    url: data.url,
    params: params,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
};

export const autocomplete = async (searchExpresion: string) => {
  const data = requestData("foods.autocomplete.v2", {
    expression: searchExpresion,
  });
  const params = oauth.authorize(data);

  return axios({
    method: data.method,
    url: data.url,
    params: params,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
};
