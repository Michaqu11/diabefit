import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { clearData, clearProfile } from "../store/sessionStorage";

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
  clearProfile();
  clearData();
  window.location.reload();
};
