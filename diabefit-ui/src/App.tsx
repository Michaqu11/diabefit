import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Setting from "./pages/Setting";
import MasterLayout from "./components/layout/MasterLayout";
import NewEntry from "./pages/NewEntry";
import NewBolus from "./pages/NewBolus";
import Home from "./pages/home/Home";
import ModelAI from "./pages/ModelAI";
import AddProduct from "./pages/AddProduct";
import "boxicons/css/boxicons.min.css";
import "./App.scss";
import { Box, Button } from "@mui/material";
import {
  getProfile,
  removeToken,
  saveProfile,
  saveToken,
} from "./store/sessionStorage";
import EmptyLayout from "./components/layout/EmptyLayout";
import { SnackbarProvider } from "notistack";
import { account } from "./api/login";
import YourData from "./pages/YourData";
import { auth, googleProvider } from "./config/firebase";
import { signInWithPopup, User } from "firebase/auth";
import { useTranslation } from "react-i18next";

const App: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(getProfile());
  const [loginStatus, setLogin] = useState<boolean>(false);

  const { t } = useTranslation();

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);

      if (user) {
        const token = await user.getIdToken();
        const tokenExpirationTime = (await user.getIdTokenResult())
          .expirationTime;
        saveToken(token, tokenExpirationTime);
        saveProfile(user);
        await account(user);

        setLogin(true);
        setProfile(user);
      } else {
        removeToken();
      }
    } catch (err) {
      console.error(err);
      removeToken();
    }
  };

  useEffect(() => {
    const manageAccount = async () => {
      if (profile && !loginStatus) {
        setLogin(true);
        await account(profile);
      }
    };
    manageAccount();
  }, [loginStatus, profile]);

  return (
    <SnackbarProvider maxSnack={2} autoHideDuration={2000}>
      <div className="root">
        {loginStatus ? (
          <>
            <MasterLayout />
            <div className="router">
              <Routes>
                <Route index element={<Home />} />
                <Route path="/entry" element={<NewEntry />} />
                <Route path="/bolus" element={<NewBolus />} />
                <Route path="/data" element={<YourData />} />
                <Route path="/ai" element={<ModelAI />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/add/:id/:meal" element={<AddProduct />} />
                <Route path="/entry/add/:id/:meal" element={<AddProduct />} />
              </Routes>
            </div>
          </>
        ) : (
          <>
            <EmptyLayout login={loginStatus} />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="90vh"
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => signInWithGoogle()}
              >
                {t("login.signIn")}
              </Button>
            </Box>
          </>
        )}
      </div>
    </SnackbarProvider>
  );
};

export default App;
