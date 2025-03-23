import axios from "axios";
import {
  getProfileId,
  getToken,
  saveModelInSessionStorage,
} from "../store/sessionStorage";
import { SERVICE_URL } from "../config/data";

export const saveModelData = async (model: string) => {
  const token = getToken();

  const { data } = await axios.post(
    `${SERVICE_URL}/model`,
    {
      id: getProfileId(),
      model: model,
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (data.error) {
    return new Error(data.error);
  }

  saveModelInSessionStorage(model);
  return data;
};
