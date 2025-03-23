import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { ReactElement } from "react";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HomeIcon from "@mui/icons-material/Home";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Link } from "react-router-dom";
import { getProfile } from "../../../store/sessionStorage";
import { Button, Grid } from "@mui/material";
import { logOut } from "../../../api/logout";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import { useTranslation } from "react-i18next";
interface IChildProps {
  toggleDrawer: (arg: boolean) => void;
}

interface ISidebarNav {
  displayKey: string;
  icon: ReactElement;
  to: string;
  section: string;
}

const Sidebar: React.FC<IChildProps> = ({ toggleDrawer }) => {
  const profile = getProfile();
  const { t } = useTranslation();

  const sidebarNavItems: ISidebarNav[] = [
    {
      displayKey: "sidepanel.home",
      icon: <HomeIcon />,
      to: "/",
      section: "",
    },
    {
      displayKey: "sidepanel.newEntry",
      icon: <BloodtypeIcon />,
      to: "/entry",
      section: "entry",
    },
    {
      displayKey: "sidepanel.newBolus",
      icon: <VaccinesIcon />,
      to: "/bolus",
      section: "bolus",
    },
    {
      displayKey: "sidepanel.yourData",
      icon: <ManageAccountsIcon />,
      to: "/data",
      section: "data",
    },
    {
      displayKey: "sidepanel.modelAI",
      icon: <AutoAwesomeIcon />,
      to: "/ai",
      section: "ai",
    },
    {
      displayKey: "sidepanel.settings",
      icon: <SettingsIcon />,
      to: "/setting",
      section: "setting",
    },
  ];

  return (
    <Box sx={{ width: 250 }} onKeyDown={() => toggleDrawer(false)}>
      {profile ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {profile.photoURL ? (
                  <Avatar src={profile.photoURL} />
                ) : (
                  <Avatar>
                    <PermIdentityOutlinedIcon />
                  </Avatar>
                )}
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
                {t("sidepanel.logOut")}
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ paddingBottom: "5px" }} />

          {sidebarNavItems.map((item, index) => (
            <Link to={item.to} key={index}>
              <ListItem disablePadding sx={{ paddingTop: "5px" }}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={t(item.displayKey)} />
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
