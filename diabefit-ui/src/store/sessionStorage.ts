import { User } from "firebase/auth";
import { IAllData, ISettings, LibreData } from "../types/settings";

export const saveProfile = (profile: User) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const getProfile = (): User | null => {
  return localStorage.getItem("profile")
    ? JSON.parse(localStorage.getItem("profile") as string)
    : null;
};

export const clearProfile = () => {
  localStorage.removeItem("profile");
};

export const getProfileId = (): string => {
  const profile: User = JSON.parse(localStorage.getItem("profile") as string);
  return profile.uid;
};

export const saveToken = (token: string, tokenExpirationTime?: string) => {
  localStorage.setItem("token", token);
  tokenExpirationTime &&
    localStorage.setItem("tokenExpirationTime", tokenExpirationTime);
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpirationTime");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getTokenExpirationTime = () => {
  return localStorage.getItem("tokenExpirationTime");
};

export const saveData = (settings: IAllData) => {
  sessionStorage.setItem("data", JSON.stringify(settings));
};

export const getData = (): IAllData => {
  return JSON.parse(sessionStorage.getItem("data") as string);
};

export const clearData = () => {
  sessionStorage.removeItem("data");
};

export const saveSettingsInSessionStorage = (settings: ISettings) => {
  const tempData = getData();
  tempData.settings = settings;
  sessionStorage.setItem("data", JSON.stringify(tempData));
};

export const saveLibreAPIInSessionStorage = (libreAPI: LibreData) => {
  const tempData = getData();
  tempData.libreAPI = libreAPI;
  sessionStorage.setItem("data", JSON.stringify(tempData));
};

export const getSettings = () => {
  const data = getData();
  return data?.settings;
};

export const getLibreAPI = () => {
  const data = getData();
  return data.libreAPI;
};

export const saveModelInSessionStorage = (model: string) => {
  const tempData = getData();
  tempData.model = model;
  sessionStorage.setItem("data", JSON.stringify(tempData));
};
