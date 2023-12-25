import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { ReactElement, useState } from "react";

import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HomeIcon from "@mui/icons-material/Home";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Link } from "react-router-dom";
import { clearProfile, getProfile } from "../../../store/sessionStorage";
import { Button, Grid } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase"
import { IProfile } from "../../../types/profile";

interface IChildProps {
  toggleDrawer: (arg: boolean) => void;
}

interface ISidebarNav {
  display: string;
  icon: ReactElement;
  to: string;
  section: string;
}

const sidebarNavItems: ISidebarNav[] = [
  {
    display: "Home",
    icon: <HomeIcon />,
    to: "/",
    section: "",
  },
  {
    display: "New Entry",
    icon: <BloodtypeIcon />,
    to: "/entry",
    section: "entry",
  },
  {
    display: "New Bolus",
    icon: <VaccinesIcon />,
    to: "/bolus",
    section: "bolus",
  },
  {
    display: "New Product",
    icon: <AddShoppingCartIcon />,
    to: "/product",
    section: "product",
  },
  {
    display: "Your Data",
    icon: <ManageAccountsIcon />,
    to: "/data",
    section: "data",
  },
  {
    display: "Setting",
    icon: <SettingsIcon />,
    to: "/setting",
    section: "setting",
  },
];

const Sidebar: React.FC<IChildProps> = ({ toggleDrawer }) => {
  const [profile] = useState<IProfile>(getProfile());

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    clearProfile();
    window.location.reload();
  };

  return (
    <Box sx={{ width: 250 }} onKeyDown={() => toggleDrawer(false)}>
      {profile ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Avatar src={profile.photoURL} />
              </ListItemIcon>
              <ListItemText primary={profile.displayName} />
            </ListItemButton>
          </ListItem>
          <Grid container>
            <Grid display="flex" justifyContent="right" alignItems="center">
              <Button
                style={{ paddingBottom: "0px", marginRight: "10px" }}
                variant="text"
                size="small"
                onClick={logOut}
              >
                Log out
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ paddingBottom: "5px" }} />

          {sidebarNavItems.map((item, index) => (
            <Link to={item.to} key={index}>
              <ListItem disablePadding sx={{ paddingTop: "5px" }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.display} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      ) : null}
    </Box>
  );
};

export default Sidebar;
