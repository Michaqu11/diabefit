import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Setting from "./pages/Setting";
import MasterLayout from "./components/layout/MasterLayout";
import NewEntry from "./pages/NewEntry";
import NewProduct from "./pages/NewProduct";
import NewBolus from "./pages/NewBolus";
import Home from "./pages/home/Home";
import AddProduct from "./pages/AddProduct";
import "boxicons/css/boxicons.min.css";
import "./App.scss";
import { Box, Button } from "@mui/material";
import { getData, getProfile, saveProfile, saveToken } from "./store/sessionStorage";
import EmptyLayout from "./components/layout/EmptyLayout";
import { SnackbarProvider } from "notistack";
import { account } from "./api/login";
import YourData from "./pages/YourData";
import { auth, googleProvider } from "./config/firebase";
import { signInWithPopup } from "firebase/auth";
import { IAllData } from "./types/settings";


const App: React.FC = () => {
  const [user, setUser] = useState<any>();
  const [token, setToken] = useState<string>('');
  const [profile, setProfile] = useState<any>(getProfile());
  const [loginStatus, setLogin] = useState<boolean>(profile !== null);
  const [data, setData] = useState<IAllData | null>(getData())


  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      setLogin(true);
      const token = await response.user?.getIdToken()
      setToken(token);
      setUser(response.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      saveProfile(user);
      saveToken(token);
      setProfile(user);

      const loadData = async () => {
        const newData = await account(user);
        setData(newData);
      }

      loadData();
    }
  }, [token, user]);


  return (
    <SnackbarProvider maxSnack={2} autoHideDuration={2000}>
      <div className="root">
        {profile ? (
          <>
            <MasterLayout />
            <div className="router">
              <Routes>
                <Route index element={<Home />} />
                <Route path="/entry" element={<NewEntry />} />
                <Route path="/bolus" element={<NewBolus />} />
                <Route path="/product" element={<NewProduct />} />
                <Route path="/data" element={data != null ? <YourData /> : <Navigate replace to={"/"} />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/add/:id/:meal" element={<AddProduct />} />
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
              <Button variant="outlined" size="large" onClick={() => signInWithGoogle()}>
                Sign in with Google 🚀
              </Button>
            </Box>
          </>
        )}
      </div>
    </SnackbarProvider>
  );
};

export default App;
