import { IProfile } from "../types/profile";
import { IAllData, ISettings } from "../types/settings";

export const saveProfile = (profile: IProfile) => {
  sessionStorage.setItem("profile", JSON.stringify(profile));
};

export const getProfile = (): IProfile => {
  return JSON.parse(sessionStorage.getItem("profile") as string);
};

export const clearProfile = () => {
  sessionStorage.removeItem("profile");
};

export const getProfileId = (): string => {
  const profile: IProfile = JSON.parse(
    sessionStorage.getItem("profile") as string,
  );
  return profile.uid;
};

export const saveToken = (token: string) => {
  sessionStorage.setItem("token", JSON.stringify(token));
}

export const getToken = (): string => {
  return JSON.parse(sessionStorage.getItem("token") as string);
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

export const saveLibreAPIInSessionStorage = (libreAPI: string) => {
  const tempData = getData();
  tempData.libreAPI = libreAPI;
  sessionStorage.setItem("data", JSON.stringify(tempData));
};

export const getSettings = () => {
  const data = getData();
  return data?.settings;
}


export const getLibreAPI = () => {
  const data = getData();
  return data.libreAPI;
}
