export const saveProfile = (profile: any) => {
  sessionStorage.setItem("profile", JSON.stringify(profile));
};

export const getProfile = () => {
  return JSON.parse(sessionStorage.getItem("profile") as string);
};
