import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import Setting from "./pages/Setting";
import MasterLayout from "./components/layout/MasterLayout";
import NewEntry from "./pages/NewEntry";
import NewProduct from "./pages/NewProduct";
import NewBolus from "./pages/NewBolus";
import Home from "./pages/home/Home";
import AddProduct from "./pages/AddProduct";
import "boxicons/css/boxicons.min.css";
import "./App.scss";
import axios from "axios";
import { Box, Button, Grid } from "@mui/material";
import { getProfile, saveProfile } from "./store/sessionStorage";

const App: React.FC = () => {
  const [user, setUser] = useState<any>();
  const [profile, setProfile] = useState<any>(getProfile);
  const [loginStatus, setLogin] = useState<boolean>(profile !== null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      setLogin(true);
    },

    onError: (error) => console.log("Login Failed:", error),
  });

  // const logOut = () => {
  //   googleLogout();
  //   setProfile(null);
  // };

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          },
        )
        .then((res: { data: any }) => {
          saveProfile(res.data);
          setProfile(res.data);
        })
        .catch((err: any) => console.log(err));
    }
  }, [user]);

  return (
    <div className="root">
      <MasterLayout login={loginStatus} />
      {profile ? (
        <div className="router">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/entry" element={<NewEntry />} />
            <Route path="/bolus" element={<NewBolus />} />
            <Route path="/product" element={<NewProduct />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/add/:id/:meal" element={<AddProduct />} />
          </Routes>
        </div>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="90vh"
        >
          <Button variant="outlined" size="large" onClick={() => login()}>
            Sign in with Google 🚀
          </Button>
        </Box>
      )}
    </div>
  );
};

export default App;